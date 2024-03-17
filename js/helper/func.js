const addZero = (z) => z < 10 ? `0${z}` : z;

const convertDate = (d) => {
  let date = new Date(d);

  return `
    ${addZero(date.getDate())}/${addZero(date.getMonth() + 1)}/${date.getFullYear()}
  `;
}