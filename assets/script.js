'use strict';
let fish = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

if (document.getElementById('section') != null) { //if this element is exsisting
    (() => {
        let section = document.getElementById('section');
        for (let i = 0; i < 20; i++) {
            let article = document.createElement("article");
            let h2 = document.createElement('h2');
            let p = document.createElement('p');
            let img = document.createElement('img');
            img.className = "arrows";
            img.src = '/assets/arrow.svg';
            article.className = "art";
            article.id = i;
            h2.id = i;
            p.id = i;
            h2.innerHTML = 'Заголовок';
            p.className = 'text';
            section.appendChild(article);
            article.appendChild(h2);
            article.appendChild(p);
            article.appendChild(img);
            p.innerHTML = fish;
        }
    })();

    let arrows = document.getElementsByClassName('arrows');
    let article = document.getElementsByClassName("art");
    [].forEach.call(article, (el) => {
        el.addEventListener("click", (e) => {
            if (article[e.target.id].style.height === 220 + 'px') {
                article[e.target.id].style.height = '80px';
                article[e.target.id].style.border = '1px solid #BFBFBF';
                arrows[e.target.id].style.transition = 'transform 0.4s';
                arrows[e.target.id].style.transform = 'rotate(0deg)'
            } else {
                article[e.target.id].style.height = '220px';
                article[e.target.id].style.border = '1px solid crimson';
                arrows[e.target.id].style.transition = 'transform 0.4s';
                arrows[e.target.id].style.transform = 'rotate(180deg)'
            }
        });
    });
}

if (document.getElementById('visible') != null){
    let vis = document.getElementById('visible');
    let pass_inp = document.getElementById('pass');
    vis.addEventListener('click', () => {
        if (pass_inp.type === "password") {
            pass_inp.type = "text";
            vis.src = "/assets/invisible.svg";
        } else {
            pass_inp.type = "password";
            vis.src = "/assets/visible.svg";
        }
    });
}

if (document.getElementById('search_label') != null) {
    let search_form = document.getElementsByClassName('search_form');
    search_form[0].addEventListener('change', () => {
        let sform = document.forms["search"];
        let inp = sform.elements["search_req"].value;
        let rad = sform.elements["radio-type"].value;
        let ch = sform.elements["check_"].value;
        let req = JSON.stringify({search_req: inp, radio: rad, check: ch});
        console.log(req);
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "/", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.addEventListener("load", () => {
            console.log(xhr.response);
        });
        xhr.send(req);
    })
}

if (document.getElementsByClassName("form-res")[0] != null) {
    let progress = document.getElementById("res-progress");
    let inputs = document.getElementsByTagName("input");
    for (let i = 0; i < 6; i++){
        inputs[i].addEventListener("change", () => {progress.value += 12.5});
    }
}
