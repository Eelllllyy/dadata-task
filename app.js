document.addEventListener('DOMContentLoaded', () => {
  const url = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party';
  const token = 'e128b3df18fdaf0bdfbdbf39aa539b073a969f77';
  const input = document.getElementById('query');
  const organization = document.getElementById('organization');
  let suggestions = [];
  input.oninput = async function (e) {
    const response = await fetch(
      url,
      {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ query: e.target.value, count: 5 }),
      },
    ).then((res) => res.text().then((result) => {
      suggestions = JSON.parse(result).suggestions;
    })).catch((error) => console.log('error', error));
    const x = document.getElementById('check');
    const r = document.getElementById('result');
    const ul = document.createElement('ul');
    while (r.firstChild) {
      r.removeChild(r.firstChild);
    }
    ul.classList.add('list');
    ul.setAttribute('id', 'theList');
    if (input.value.length > 0 && suggestions.length > 0) {
      x.style.display = 'block';
      const notion = document.createElement('p');
      const text = document.createTextNode('Выберите вариант или продолжите ввод');
      notion.appendChild(text);
      ul.appendChild(notion);
      notion.classList.add('gray-text', 'smaller');
      notion.setAttribute('id', 'notion');
    } else if (input.value.length > 0 && suggestions.length === 0) {
      const notFound = document.createElement('li');
      const text = document.createTextNode('Неизвестная организация');
      notFound.appendChild(text);
      notFound.classList.add('gray-text', 'smaller');
      ul.appendChild(notFound);
    } else {
      x.style.display = 'none';
    }
    for (let i = 0; i <= suggestions.length - 1; i++) {
      const li = document.createElement('li');
      const title = document.createElement('p');
      const kpp = document.createElement('span');
      const address = document.createElement('span');
      title.innerHTML = suggestions[i]?.value;
      kpp.innerHTML = suggestions[i]?.data?.kpp;
      address.innerHTML = suggestions[i]?.data?.address?.value;
      const searchText = e.target.value;
      const regex = new RegExp(searchText, 'gi');
      let text = title.innerHTML;
      text = text.replace(/(<span style="color: blue;">|<\/span>)/gim, '');
      const newText = text.replace(regex, '<span style="color: blue;">$&</span>');
      title.innerHTML = newText;
      kpp.classList.add('gray-text');
      address.classList.add('gray-text');
      li.setAttribute('style', 'display: block;');
      li.appendChild(title);
      li.appendChild(kpp);
      li.appendChild(address);
      li.onclick = (e) => {
        e.stopPropagation();
        selectOne(i);
      };
      ul.appendChild(li);
    }
    r.appendChild(ul);
  };
  function selectOne(i) {
    if (organization.children.length > 1) {
      organization.removeChild(organization.lastElementChild);
    }
    document.getElementById('check').style.display = 'none';
    organization.style.display = 'block';
    const organizationData = document.createElement('span');
    const text = document.createTextNode(`(${suggestions[i].data.type})`);
    organizationData.appendChild(text);
    organization.appendChild(organizationData);
    input.value = suggestions[i].value;
    document.getElementById('shortTitle').value = suggestions[i].value;
    document.getElementById('fullTitle').value = suggestions[i].data.name.full_with_opf;
    document.getElementById('inn').value = `${suggestions[i].data.inn} / ${suggestions[i].data.kpp}`;
    document.getElementById('address').value = suggestions[i].data.address.value;
  }
});
