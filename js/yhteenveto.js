'use strict';

const nappi = document.getElementById('teemanVaihto');
const ylapalkki = document.getElementById('ylapalkki');
const yhteenvetoButton = document.getElementById('yhteenvetoButton');
let vari = 0;
console.log(vari);

if (!(isNaN(getVariInfo()))) {
    vari = getVariInfo();
} else
    vari = 0;


nappi.addEventListener('click', function(evt) {
    vari++;
});

nappi.addEventListener('mouseenter', teemanVaihtoYhteenveto);
nappi.addEventListener('mouseleave', teemanVaihtoYhteenveto);


function teemanVaihtoYhteenveto() {
    if(vari%2 === 0) {
        vari = 0;
        document.body.style.backgroundColor = 'black';
        ylapalkki.style.backgroundColor = 'black';
        ylapalkki.style.backgroundImage = "url('img/frisbeeKuvaValkoinen.png')";
        yhteenvetoButton.style.borderColor = 'lightgray';
        yhteenvetoButton.style.backgroundImage = "url('img/yhteenvetoValkoinen.png')";
        nappi.innerText = 'vaalea teema';
    } else {
        document.body.style.backgroundColor = 'white';
        ylapalkki.style.backgroundColor = 'white';
        ylapalkki.style.backgroundImage = "url('img/frisbeeKuvaMusta.png')";
        yhteenvetoButton.style.borderColor = 'lightgray';
        yhteenvetoButton.style.backgroundImage = "url('img/yhteenvetoMusta.png')";
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

teemanVaihtoYhteenveto();
teemanVaihtoYhteenveto();