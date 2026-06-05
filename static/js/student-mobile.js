(function(){
  function setOpen(open){
    document.body.classList.toggle('sp-menu-open', !!open);
  }
  window.toggleStudentMenu=function(){
    setOpen(!document.body.classList.contains('sp-menu-open'));
  };
  window.closeStudentMenu=function(){ setOpen(false); };
  document.addEventListener('keydown', function(e){
    if(e.key==='Escape') setOpen(false);
  });
  document.addEventListener('click', function(e){
    const a=e.target.closest('.sp-sidebar a');
    if(a && window.innerWidth<=900) setOpen(false);
  });
  window.addEventListener('resize', function(){
    if(window.innerWidth>900) setOpen(false);
  });
})();
