function buttonRedirect(id, type, nextPageURL){
    //todo log page name and resaponse to database
    //alert("PAGE NAME IS : ", pageName)
    window.location.href=`/${id}/EducationalComponent/${type}/${nextPageURL}`;
   
}