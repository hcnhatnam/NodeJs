function include(file) {
  var script = document.createElement("script");
  script.src = file;
  script.type = "text/javascript";
  script.defer = true;

  document
    .getElementsByTagName("head")
    .item(0)
    .appendChild(script);
}

include("./util.js");
var listItem = document.getElementById("listItem");
console.log(listItem);
let createItem = function(id, name) {
  let element = `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
    <span class="item-text">${name}</span>
    <div  data-id_item=${id} >
      <button class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
      <button class="delete-me btn btn-danger btn-sm">Delete</button>
    </div>
  </li>`;
  listItem.insertAdjacentHTML("beforebegin", element);
};
axios
  .get("/items")
  .then(function(res) {
    let arrData = res.data;
    console.log(arrData);
    arrData.map(function(item) {
      console.log(item._id, item.name);
      createItem(item._id, item.name);
    });
  })
  .catch(function(error) {
    console.log(error);
  });

let updateItem = function(id, updateValue) {
  console.log(id, updateValue);
  axios({
    method: "post",
    url: "/updateitem",
    data: {
      id: id,
      updateValue: updateValue
    }
  })
    .then(function(res) {
      console.log(res);
    })
    .catch(function(error) {
      console.log(error);
    });
};

let deleteItem = function(id, callBack) {
  console.log(id);
  axios({
    method: "post",
    url: "/deleteitem",
    data: {
      id: id
    }
  })
    .then(function(res) {
      console.log(res);

      callBack(isResponseSucces(res));
    })
    .catch(function(error) {
      console.log(error);
    });
};
document.addEventListener("click", function(event) {
  if (event.target.classList.contains("edit-me")) {
    let updateValue = prompt("Enter your update value?");
    if (updateValue != "") {
      updateItem(
        event.target.parentElement.getAttribute("data-id_item"),
        updateValue
      );
    }
  } else if (event.target.classList.contains("delete-me")) {
    deleteItem(
      event.target.parentElement.getAttribute("data-id_item"),
      function(error) {
        if (error == false) {
          event.target.parentElement.parentElement.remove();
        }
      }
    );
  }
});
