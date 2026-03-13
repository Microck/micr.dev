import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

function getRepoInfo(): { owner: string; repo: string } {
  const repoPath = process.env.GITHUB_REPO;
  if (!repoPath) {
    throw new Error('GITHUB_REPO environment variable not set');
  }
  const [owner, repo] = repoPath.split('/');
  if (!owner || !repo) {
    throw new Error('GITHUB_REPO must be in format owner/repo');
  }
  return { owner, repo };
}

export interface FileContent {
  path: string;
  content: string;
  sha?: string;
}

export async function getFileContent(path: string): Promise<{ content: string; sha: string } | null> {
  const { owner, repo } = getRepoInfo();
  try {
    const response = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });

    if ('content' in response.data && typeof response.data.content === 'string') {
      const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
      return { content, sha: response.data.sha };
    }
    return null;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function createOrUpdateFile(
  path: string,
  content: string,
  message: string,
  sha?: string
): Promise<{ sha: string; url: string }> {
  const { owner, repo } = getRepoInfo();
  
  // Get existing SHA if not provided
  let fileSha = sha;
  if (!fileSha) {
    const existing = await getFileContent(path);
    fileSha = existing?.sha;
  }

  const response = await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message,
    content: Buffer.from(content).toString('base64'),
    sha: fileSha,
  });

  return {
    sha: response.data.content?.sha || '',
    url: response.data.content?.html_url || '',
  };
}

export async function deleteFile(
  path: string,
  message: string,
  sha: string
): Promise<void> {
  const { owner, repo } = getRepoInfo();
  
  await octokit.repos.deleteFile({
    owner,
    repo,
    path,
    message,
    sha,
  });
}

export interface CommitFile {
  path: string;
  content: string | null; // null means delete
}

export async function commitMultipleFiles(
  files: CommitFile[],
  message: string
): Promise<{ sha: string }> {
  const { owner, repo } = getRepoInfo();

  // Get the default branch
  const { data: repoData } = await octokit.repos.get({ owner, repo });
  const defaultBranch = repoData.default_branch;

  // Get the latest commit SHA
  const { data: refData } = await octokit.git.getRef({
    owner,
    repo,
    ref: `heads/${defaultBranch}`,
  });
  const latestCommitSha = refData.object.sha;

  // Get the tree SHA from the latest commit
  const { data: commitData } = await octokit.git.getCommit({
    owner,
    repo,
    commit_sha: latestCommitSha,
  });
  const baseTreeSha = commitData.tree.sha;

  // Create blobs for each file
  const treeItems: Array<{
    path: string;
    mode: '100644';
    type: 'blob';
    sha: string | null;
  }> = [];

  for (const file of files) {
    if (file.content === null) {
      // Delete file by not including it (handled differently)
      treeItems.push({
        path: file.path,
        mode: '100644',
        type: 'blob',
        sha: null,
      });
    } else {
      // content is already base64, pass directly
      const { data: blobData } = await octokit.git.createBlob({
        owner,
        repo,
        content: file.content,
        encoding: 'base64',
      });
      treeItems.push({
        path: file.path,
        mode: '100644',
        type: 'blob',
        sha: blobData.sha,
      });
    }
  }

  // Create new tree
  const { data: newTree } = await octokit.git.createTree({
    owner,
    repo,
    base_tree: baseTreeSha,
    tree: treeItems,
  });

  // Create commit
  const { data: newCommit } = await octokit.git.createCommit({
    owner,
    repo,
    message,
    tree: newTree.sha,
    parents: [latestCommitSha],
  });

  // Update ref without force so concurrent commits fail instead of being overwritten.
  await octokit.git.updateRef({
    owner,
    repo,
    ref: `heads/${defaultBranch}`,
    sha: newCommit.sha,
  });

  return { sha: newCommit.sha };
}

export async function uploadBinaryFile(
  path: string,
  content: Buffer,
  message: string
): Promise<{ sha: string; url: string }> {
  const { owner, repo } = getRepoInfo();
  
  // Check if file exists to get SHA
  let fileSha: string | undefined;
  try {
    const existing = await getFileContent(path);
    fileSha = existing?.sha;
  } catch {
    // File doesn't exist
  }

  const response = await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message,
    content: content.toString('base64'),
    sha: fileSha,
  });

  return {
    sha: response.data.content?.sha || '',
    url: response.data.content?.html_url || '',
  };
}
