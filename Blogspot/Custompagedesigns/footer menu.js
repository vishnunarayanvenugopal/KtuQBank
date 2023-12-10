<style>
.search-form-wrapper {
    background: #000;
    background: rgba(0,0,0,.8);
    z-index: 99;
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
   }
.search-form-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
}
.search-form {
    position: absolute;
    width: 100%;
    height: 1px;
    left: 0;
    top: 40%;
    text-align: center;
}
.search-form-label {
    position: absolute;
    bottom: 100%;
    width: 100%;
    display: block;
    left: 0;
    color: #fff;
    font-size: 40px;
    font-weight: 400;
}
@media only screen and (max-width: 699px)
.search-form-label {
    font-size: 26px;
}
.search-text, form input[type=text].search-text {
    position: absolute;
    top: 100%;
    width: 50%;
    left: 0;
    right: 0;
    margin: 20px auto 0 auto;
    background: 0 0;
    border: none;
    border-bottom: 1px dashed #ddd;
    font-size: 60px;
    color: #fff;
    text-align: center;
    outline: 0;
    min-width: 300px;
}
form input[type=email], form input[type=name], form input[type=text], form textarea {
    max-width: 100%;
    display: block;
    width: 100%;
    box-sizing: border-box;
    border: 1px solid #ccc;
    padding: 10px;
    margin: 5px 0 15px 0;
    box-shadow: inset 0 0 10px rgba(0,0,0,.1);
}
@media only screen and (max-width: 699px)
.search-submit {
    background: 0 0;
    border: 1px solid #ddd;
    padding: 20px 0;
    color: #fff;
    position: absolute;
    display: block;
    width: 200px;
    box-sizing: border-box;
    top: 100%;
    margin-top: 120px;
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
    cursor: pointer;
    font-size: 20px;
}
div.onsearch:active{}

/* CSS Reset used: http://seodesigns.com/projects/codepen/reset.css */


/* The Modal (background) */
.modal {
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}

/* Modal Content/Box */
.modal-content {
  background-color: #fefefe;
  margin: 15% auto; /* 15% from the top and centered */
  padding: 20px;
  border: 1px solid #888;
  width: 80%; /* Could be more or less, depending on screen size */
}

/* The Close Button */
.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}













/* CSS Reset used: http://seodesigns.com/projects/codepen/reset.css */
.sticky-footer {
  display: none;
  height: 42px;
  background: #ffffff;
  position: fixed;
padding-top:3px;
  bottom: 0px;
  left: 0px;
  width: 100%;
  z-index: 15;
    border-top: 1px solid #eee;
    -webkit-box-shadow: 0px -16px 49px 13px rgba(0, 0, 0, 0.18);
   box-shadow: 0px -16px 49px 13px rgba(0, 0, 0, 0.18);
display: none;

}




.sticky-footer .one-fourth {
  width: 20%;
  float: left;
  color: rgba(99, 100, 102, 1);
  text-align: center;
  height: 58px;
  position: relative;
  cursor: pointer;
}
.sticky-search,
.sticky-filters,
.sticky-map,
.sticky-radius {
  width: 25px;
  height: 25px;
  margin: auto;
  margin-top: 8px;
}
.sticky-footer .one-fourth p {
  font-size: 10px;
  margin-top: 3px;
}
#searchmenu{width: 100%;
  background: blue;
 height: 100%;
}

 /* Smartphone Portrait and Landscape */
@media only screen and (max-width: 600px) {
.sticky-footer {display: block;}}


.sticky-filters:hover{   color: #fe6258;}
.pop-up{ display: none;}


div#content-mobile {
    font-size: 17px !important;
}

</style>

<script>
$("#search").click(function() {
  $(this).toggleClass("on");
  $("#searchmenu").slideToggle();
});
</script>
<script>
function myFunction() {
    document.getElementByClass("search-form-wrapper").style.display = "Block";
}
</script>




<!-- search pop win. -->
<div class="search-form-wrapper" id="id01" >
<div class="search-form-overlay"></div>
<form action="/search" class="search-form" method="get">
<label class="search-form-label"><span data-l10n="Type something and Enter">Search Here</span></label>
<input class="search-text" name="q" type="text" value="" />
<button class="hide search-submit" type="submit"><span data-l10n="Search">Search</span></button>
</form>
</div>




 <div id="content-mobile" class="sticky-footer" style="font:unset;">
     
    <div onclick="document.getElementById('id01').style.display='block'" class="one-fourth"  id="filters"><i class="fa fa-search " ></i>
      <p>search</p>
    </div>
    
    <div class="one-fourth" id="filters"><a href="https://www.ktuqbank.com" style="a:visited {
    text-decoration: none;
    color: rgba(99, 100, 102, 1);
}"><i class="fa fa-home" style="a:visited {
    text-decoration: none;
    color: rgba(99, 100, 102, 1);
}"></i></a>
      <p>Home</p>
    </div>
    
   <div class="one-fourth" id="map"><a href="https://instagram.com/ktuqbank/" target="_blank" style="a:visited {
    text-decoration: none;
    color: rgba(99, 100, 102, 1);
}"><i class="fa fa-newspaper-o " style="a:visited {
    text-decoration: none;
    color: rgba(99, 100, 102, 1);
}"></i></a>
      <p>KTU News</p>
    </div>
    
   <!-- <div class="one-fourth" id="radius"><i class="fas fa-robot sticky-filters"></i> -->
   <div class="one-fourth" id="radius"><a href="https://link.ktuqbank.com/join" target="_blank"><i class="fa fa-whatsapp"></i></a>
      <p>KTU updates</p>
    </div>

    <div class="one-fourth" id="more"><a href="https://t.me/ktuliveupdates" target="_blank"><i class="fa fa-telegram"></i></a>
      <p>KTU Updates</p>
    </div>
    
  </div>
