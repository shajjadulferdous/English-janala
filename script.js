function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

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
        div.innerHTML = `<button id="lesson-btn-${element.level_no}" onclick="loadLevelWord(${element.level_no})" class="btn btn-outline btn-primary p-4 optional">
                <i class="fa-solid fa-book-open"></i>Leason-${element.level_no}
            </button>`;
        allLeason.append(div);
    });
}

loadLeason();

const loadLevelWord = (level_no) =>{
      manageSpiner(true);
      fetch(`https://openapi.programming-hero.com/api/level/${level_no}`)
      .then(res => res.json())
      .then(res =>{ 
        const words = res?.data;
        displayLevelWord(words)
        removeActiveClass();
        const theActiveBtn = document.getElementById(`lesson-btn-${level_no}`);
        theActiveBtn.classList.add('active');
    });
}

const removeActiveClass = () =>{
    const allLevel = document.querySelectorAll('.optional');
    console.log(allLevel);
    allLevel.forEach(ele =>{
        ele.classList.remove('active');
    })
}

const displayLevelWord = (arr) =>{
    const wordContainers = document.getElementById('word-containers');
    wordContainers.innerHTML = '';
    if(arr.length === 0){
        wordContainers.innerHTML = `<div class="font-bangla p-10  text-center space-y-3">
             <div class="flex justify-center items-center">
             <img src="./assets/alert-error.png"  alt="">
             </div>
             <p>এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
             <h1 class="text-4xl font-semibold">নেক্সট Lesson এ যান</h1>
        </div>`
        manageSpiner(false);
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
                <button onClick="loadWordDetails(${element?.id})" class="btn"><i class="fa-solid fa-circle-info"></i></button>
                <button onClick="pronounceWord('${element.word}')" class="btn"><i class="fa-solid fa-volume-low"></i></button>
            </div>`;
            borodiv.append(div);
        })
      wordContainers.append(borodiv);
      manageSpiner(false);
}

const loadWordDetails = async (id)=>{
     const  url = `https://openapi.programming-hero.com/api/word/${id}`;
     const  res  = await fetch(url);
     const details = await res.json();
     displayWordDetails(details?.data);
}

const createElementSym = (arr) =>{
    const htmlElements = arr.map(ele =>{
        return `<span class="btn">${ele}</span>`
    });
    return htmlElements.join(" ");
}
const displayWordDetails = (word) =>{
     const detailsBox = document.getElementById('details-box');
     console.log(word);
     detailsBox.innerHTML = `<div class="space-y-2">
         <h1 class="font-bold text-3xl">${word.word} <i class="fa-solid fa-microphone-lines"> </i>${word.pronunciation} </h1>
         <div>
         <h2 class="font-bold text-xl">Meaning</h2>
         <p class="font-bold">${word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"}</p>
         </div>
         <div>
             <h2 class="font-bold text-xl">Example</h2>
             <p class="">${word.sentence ? word.sentence : "Example পাওয়া যায়নি"}</p>
         </div>
         <div>
            <h1 class="font-bangla font-bold mb-1">সমার্থক শব্দ গুলো</h1>
            <div> ${word.synonyms.length ? createElementSym(word.synonyms) : "সমার্থক শব্দ পাওয়া যায়নি"} </div>
         </div>
    </div>`;
     const value = document.getElementById('my_modal_5');
     value.showModal();
}

const manageSpiner = (status)=>{
     if (status == true){
         document.getElementById('spiner').classList.remove('hidden');
         document.getElementById('word-containers').classList.add('hidden');
     }
     else{
        document.getElementById('spiner').classList.add('hidden');
        document.getElementById('word-containers').classList.remove('hidden');
     }
}

document.getElementById('btn-search').addEventListener('click' , () =>{
    removeActiveClass();
    const input = document.getElementById('input-search');
    const serchValue = input.value;
    fetch(`https://openapi.programming-hero.com/api/words/all`)
    .then(res => res.json())
    .then((data) =>{
         const allword = data.data;
         const filterWords = allword.filter((word) =>word.word.toLowerCase().includes(serchValue.toLowerCase()));
         displayLevelWord(filterWords);
    })
})