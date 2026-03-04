

const loadLeason = () =>{
    fetch(`https://openapi.programming-hero.com/api/levels/all`)
    .then(res => res.json())
    .then(res => displayLeason(res))
}
const displayLeason = (leasons) =>{
    const allLeason = document.getElementById('level-containers');
    allLeason.innerHTML ="";
    const data = leasons?.data;
    data.forEach(element => {
        const div  = document.createElement('div');
        div.innerHTML = `<button onclick="loadLevelWord(${element.level_no})" class="btn btn-outline btn-primary p-4">
                <i class="fa-solid fa-book-open"></i>Leason-${element.level_no}
            </button>`;
        allLeason.append(div);
    });
    console.log(allLeason)
}
loadLeason();

const loadLevelWord = (level_no) =>{
      fetch(`https://openapi.programming-hero.com/api/level/${level_no}`)
      .then(res => res.json())
      .then(res => displayLevelWord(res));
}

const displayLevelWord = (words) =>{
    const wordContainers = document.getElementById('word-containers');
    wordContainers.innerHTML = '';
    const arr = words ?.data;
    if(arr.length === 0){
        wordContainers.innerHTML = `<div class="font-bangla p-10  text-center space-y-3">
             <div class="flex justify-center items-center">
             <img src="./assets/alert-error.png"  alt="">
             </div>
             <p>এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
             <h1 class="text-4xl font-semibold">নেক্সট Lesson এ যান</h1>
        </div>`
        return;
    }
    
    const borodiv = document.createElement('div');
    borodiv.className = `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-between p-4`;
    arr.forEach(element =>{
        const div = document.createElement('div');
        div.className = 'bg-white p-4 transition-all rounded-xl duration-300 hover:-translate-y-1';
        div.innerHTML = `<div class="text-center space-y-4  p-10">
            <h2 class="text-3xl font-bold text-center">${element.word ? element.word:"শব্দ পাওয়া যায়নি"}</h2>
            <p>Meaning /Pronounciation</p>
            <h2 class="text-2xl font-bangla font-semibold">"${element.meaning?element.meaning :"অর্থ পাওয়া যায়নি"} / ${element.pronunciation?element.pronunciation:"Pronounciation পাওয়া  যায়নি"}"</h2>
            </div>
            <div class="flex justify-between">
                <button class="btn"><i class="fa-solid fa-circle-info"></i></button>
                <button class="btn"><i class="fa-solid fa-volume-low"></i></button>
            </div>`;
            borodiv.append(div);
        })
      wordContainers.append(borodiv);
}