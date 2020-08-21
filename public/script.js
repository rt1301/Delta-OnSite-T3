var matchList = document.getElementById('match-list');
var search    = document.getElementById('search');
// Search Students File and filter it
const searchStudents = async (searchText)=>{
    const res = await fetch("/api/students");
    const students = await res.json();
    // Get Matches to current text input
    let matches = students.filter(student=>{
        const regex = new RegExp(`^${searchText}`,'gi');
        return student.name.match(regex) || student.roll.match(regex);
    });
    if(searchText.length == 0)
    {
        matches = [];
        matchList.innerHTML = '';
    }
    outputHtml(matches);
}
// Show results in html
const outputHtml = (matches)=>
{
    if(matches.length>0)
    {
        const html = [];
        for(var i=0;i<matches.length;i++)
        {
             html.push(`<div class="card card-body mb-1">
            <h4>Name: <span class="name">${matches[i].name}</span></h4> <span class="text-primary">RollNo: <span class="roll">${matches[i].roll}</span></span>
             </div>`);
        }
        matchList.innerHTML = html.join('');
    }
}
if(search.length!==0)
{
    search.addEventListener('input',()=>searchStudents(search.value));
}