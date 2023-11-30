const form = document.querySelector('form')

form.addEventListener('submit', async (e) => {
    e.preventDefault()
    
    const url = inputURL.value
    const itag = document.querySelector('select').value

    const link = await downloadLink(url, itag)
})

const inputURL = document.querySelector('#input-url')

inputURL.addEventListener('change', async (e) => {
    const data = await validateURL(e.target.value)
    if (!data) return

    const select = document.createElement('select')
    const button = document.createElement('button')
    button.innerHTML = 'Download'
    button.type = 'submit'

    form.appendChild(select)

    data.forEach(element => {
        const optionSelect = document.createElement('option')
        optionSelect.value = element.itag
        if (element.format !== 'mp3')
            optionSelect.innerHTML = `Format: ${element.format} / Quality: ${element.qualityLabel} / Has Audio: ${element.hasAudio}`
        else
            optionSelect.innerHTML = `Format: ${element.format} / Has Audio: ${element.hasAudio}`
        select.appendChild(optionSelect)
    })

    form.appendChild(button)

})

const validateURL = async (value) => {
    let req = await fetch('/info?url=' + value)
    let res = await req.json()
    return res
}

const downloadLink = async (url, itag) => {
    const req = await fetch(`/download?url=${url}&itag=${itag}`)
    const res = await req.json()
    return res
}