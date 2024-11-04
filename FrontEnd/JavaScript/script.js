const worksApi ="http://localhost:5678/api/works";

    async function getWorks() {
        const worksApi="http://localhost:5678/api/works"
        try{
            const response= await fetch(worksApi);
            if (!response.ok) {
                throw new Error(`Response status:${response.status}`);
            }

            const json= await response.json();

            for(let i= 0; i < json.length; i++) {
                buildFigure(json[i])

            }

        }catch(error){
            console.error(error.message);

        }
    }
    getWorks();

    
   function buildFigure(data){
    const figure= document.createElement("figure")
    figure.innerHTML= `<img src=${data.imageUrl} alt=${data.title}>
				      <figcaption>${data.title}</figcaption>`;

    document.querySelector(".gallery").append(figure);   
   }



   async function getCategories() {
    const worksApi="http://localhost:5678/api/categories"
    try{
        const response= await fetch(worksApi);
        if (!response.ok) {
            throw new Error(`Response status:${response.status}`);
        }

        const json= await response.json();
        console.log(json);

        for(let i= 0; i < json.length; i++) {
            buildFilter(json[i])

        }

    }catch(error){
        console.error(error.message);

    }
}
getCategories();


function buildFilter(data) {
  const div= document.createElement("div")
  div.innerHTML=`${data.name}`;

  document.querySelector(".div_box").append(div); 

}


 