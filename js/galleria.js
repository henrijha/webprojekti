'use strict';

const nappi = document.getElementById('teemanVaihto');
const ylapalkki = document.getElementById('ylapalkki');
const yhteenvetoButton = document.getElementById('yhteenvetoButton');
const homeButton = document.getElementById('homeButton');
const mappi = document.getElementById('map');
let vari = 0;
console.log(vari);

if (!(isNaN(getVariInfo()))) {
    vari = getVariInfo();
} else
    vari = 0;


nappi.addEventListener('click', function(evt) {
    vari++;
});

nappi.addEventListener('mouseenter', teemanVaihtoHome);
nappi.addEventListener('mouseleave', teemanVaihtoHome);

function teemanVaihtoHome() {
    if(vari%2 === 0) {
        vari = 0;
        document.body.style.backgroundColor = 'black';
        ylapalkki.style.backgroundColor = 'black';
        mappi.style.backgroundColor = 'white';
        ylapalkki.style.backgroundImage = "url('img/frisbeeKuvaValkoinen.png')";
        yhteenvetoButton.style.backgroundImage = "url('img/yhteenvetoValkoinen.png')";
        homeButton.style.borderColor = 'lightgray';
        nappi.innerText = 'vaalea teema';
    } else {
        document.body.style.backgroundColor = 'white';
        ylapalkki.style.backgroundColor = 'white';
        mappi.style.backgroundColor = 'black';
        ylapalkki.style.backgroundImage = "url('img/frisbeeKuvaMusta.png')";
        yhteenvetoButton.style.backgroundImage = "url('img/yhteenvetoMusta.png')";
        homeButton.style.borderColor = 'lightgray';
        nappi.innerText = 'tumma teema';
    }
    vari++;
    tallennaVari(vari);
    console.log(vari);

}

function tallennaVari(data) {
    localStorage.setItem('variData', JSON.stringify(data));
}

function getVariInfo() {
    var variInfo = localStorage.getItem('variData');
    return parseInt(JSON.parse(variInfo));
}

function viewInNewWindow(vidsrc) {
    let naytonLeveys = screen.width * (2/3);
    let naytonKorkeus = screen.height * (2/3);
    let viewin = window.open(vidsrc, 'viewin', `width=${naytonLeveys}, height=${naytonKorkeus}`);
}

teemanVaihtoHome();
teemanVaihtoHome();