const downloadFolder = async (repoUrl) => {

    const url = new URL(repoUrl)
    const pathname = url.pathname
    const pathParts = pathname.split('/')
    repo = pathParts[2]
    const folderPath = pathParts.slice(5).join('/')
    const apiUrl = `https://api.github.com/repos/PaulleDemon/${repo}/contents/${folderPath}`
    const response = await fetch(apiUrl)
    const data = await response.json()

    const zip = new JSZip()
    const folder = zip.folder(repo)
    const files = []
    for (const file of data) {
        if (file.type === 'file') {
            const fileUrl = file.download_url
            const fileResponse = await fetch(fileUrl)
            const fileData = await fileResponse.blob()
            const fileName = file.name;
            files.push({ fileName, fileData })
        }
    }
    for (const file of files) {
        folder.file(file.fileName, file.fileData)
    }
    const content = await zip.generateAsync({ type: 'blob' })
    const blobUrl = URL.createObjectURL(content)
    const link = document.createElement('a')
    link.href = blobUrl
    // download name repo and folder name taken last part of the folder path
    link.download = `${folderPath.split('/').pop()}.zip`
    link.click()
    link.remove()
    URL.revokeObjectURL(blobUrl)
    return
}