let form = document.getElementById('urlForm')
form.addEventListener('submit', makeShortUrl)

async function makeShortUrl(e) {
  e.preventDefault()
  let spinner = document.querySelector('.spinner-border')
  spinner.style.display = 'inline-block'
  let obj = {
    url: document.getElementById('url').value,
  }
  const response = await fetch('makeShorturl', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(obj),
  })
  const data = await response.json()
  spinner.style.display = 'none'

  document.getElementById(
    'link-msg'
  ).innerHTML = `Your short url is: <a href="${data.link}">${data.link}</a>`
}
