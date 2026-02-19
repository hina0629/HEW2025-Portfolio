/* ハンバーガーメニュー */
const togglebutton = document.getElementById("menu-toggle");
const menu = document.getElementById("side-menu");
const icon = togglebutton.querySelector("i");

togglebutton.addEventListener("click", function () {
    menu.classList.toggle("open");
    
    icon.style.opacity = "0";
    icon.style.transform = "scale(0.8)";

    setTimeout( function () {
        icon.classList.toggle("fa-bars");
        icon.classList.toggle("fa-xmark");

        icon.style.opacity = "1";
        icon.style.transform = "scale(1)";
    }, 200);
});

/* 検索窓Enterを押して検索 */
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        /* ページのリロード防止 */
        event.preventDefault();
        const keyword = searchInput.value.trim();
        if (keyword !== "") {
            window.location.href = `list.html?search=${encodeURIComponent(keyword)}`;
        }
            }
})


/* ランダム表示 */
const random = document.getElementById("random");

for (let i = 0; i < 6; i++) {
    let No = Math.floor(Math.random() * 151) + 1;
    /* ゼロパディング */
    const paddedNumber = String(No).padStart(3, '0');

    const pokemonCard = document.createElement('div');
    pokemonCard.classList.add('pokemon-card');

    const pokemonImage = document.createElement('img');
    pokemonImage.src = `./img/${paddedNumber}.png`;
    pokemonImage.alt = `ポケモンNo.${paddedNumber}`;
    
    // マウスオーバーでGIFに変更
    pokemonImage.addEventListener("mouseover", function () {
        pokemonImage.src = `./img/${paddedNumber}gif.png`;
    });

    // 元の画像に戻す
    pokemonImage.addEventListener("mouseout", function () {
        pokemonImage.src = `./img/${paddedNumber}.png`;
    });

    pokemonCard.appendChild(pokemonImage);
    random.appendChild(pokemonCard);
};