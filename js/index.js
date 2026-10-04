var fullNameInput = document.getElementById("full_name");
var emailInput = document.getElementById("email");
var phoneInput = document.getElementById("phone");
var addressInput = document.getElementById("address");
var groupInput = document.getElementById("group");
var notesInput = document.getElementById("notes");
var favoriteInput = document.getElementById("favorite");
var emergencyInput = document.getElementById("emergency");
var submitButton = document.getElementById("submitButton");
var contactsContainer = document.getElementById("contactsContainer");
var totalContacts = document.getElementById("totalContacts");
var favoriteContacts = document.getElementById("favoriteContacts");
var emergencyContacts = document.getElementById("emergencyContacts");
var favoriteContactsContainer = document.getElementById("favoriteContactsContainer");
var emergencyContactsContainer = document.getElementById("emergencyContactsContainer");
var searchInput = document.getElementById("searchInput");
var nameError = document.getElementById("nameError");
var phoneError = document.getElementById("phoneError");
var emailError = document.getElementById("emailError");
var contacts = JSON.parse(localStorage.getItem("contacts")) || [];
var currentEditIndex = null;
displayContacts(contacts);

function prepareAddContact() {
  document.getElementById("updateContactBtn").classList.add("d-none");
  document.getElementById("submitButton").classList.remove("d-none");
  currentEditIndex = null;
}
function addContact() {
  for (var i = 0; i < contacts.length; i++) {
    if (contacts[i].phone === phoneInput.value) {
      Swal.fire({
        icon: "error",
        title: "Duplicate Phone Number",
        text: "A contact with this phone number already exists!",
      });
      return;
    }
  }

  if (!validateName()) {
    Swal.fire({
      icon: "error",
      title: "Invalid Name",
      text: "Name should contain only letters and spaces (2-50 characters)",
    });
    return;
  }
  if (!validatePhone()) {
    Swal.fire({
      icon: "error",
      title: "Invalid Phone",
      text: "Please enter a valid Egyptian phone number (e.g., 01012345678 or +201012345678)",
    });
    return;
  }
  if (!validateEmail()) {
    return;
  }

  var newContact = {
    fullName: fullNameInput.value,
    email: emailInput.value,
    phone: phoneInput.value,
    address: addressInput.value,
    group: groupInput.value,
    notes: notesInput.value,
    favorite: favoriteInput.checked,
    emergency: emergencyInput.checked
  };

  contacts.push(newContact);
  clearForm();
  Swal.fire({
    text: "You created a new contact!",
    icon: "success"
  });
  displayContacts(contacts);
  localStorage.setItem("contacts", JSON.stringify(contacts));
  closeContactModal()




}
function clearForm() {
  fullNameInput.value = "";
  emailInput.value = "";
  phoneInput.value = "";
  addressInput.value = "";
  groupInput.value = "";
  notesInput.value = "";
  favoriteInput.checked = false;
  emergencyInput.checked = false;
  nameError.classList.add("d-none");
  phoneError.classList.add("d-none");
  emailError.classList.add("d-none");
}
function displayContacts(arr) {
  var cartoona = "";
  var favcartoona = "";
  var emercartoona = "";
  favoriteContacts.textContent = favCount();
  emergencyContacts.textContent = emerCount();
  totalContacts.textContent = contacts.length;
  if (arr.length === 0) {
    contactsContainer.innerHTML = `<div class="col-12 text-center py-5">
                <div
                  class="d-flex align-items-center justify-content-center mx-auto mb-3 rounded-3 bg-light"
                >
                  <i
                    class="fa-solid fa-address-book text-secondary"
                    style="font-size: 32px"
                  ></i>
                </div>

                <p class="text-secondary fw-medium mb-1">No contacts found</p>
                <p class="text-muted small">
                  Click "Add Contact" to get started
                </p>
              </div>`
    favoriteContactsContainer.innerHTML = "";
    emergencyContactsContainer.innerHTML = "";
    return;
  }

  for (var i = 0; i < arr.length; i++) {
    var conIndex = contacts.indexOf(arr[i]);
    cartoona += `<div  class="col-12 col-sm-6" >
                <div class="contact_card rounded-4 h-100 d-flex flex-column">
                  <div class="contact_card_body flex-grow-1">
                    <div class="d-flex gap-3">
                      <div class="contact_avatar_wrap position-relative">
                        <div
                          class="contact_avatar rounded-3 bg_violet d-flex align-items-center justify-content-center"
                        >
                          ${getinitials(arr[i].fullName)}
                        </div>
                        <span
                          class="contact_dot contact_dot_emer rounded-circle  ${arr[i].emergency ? "d-flex" : "d-none"}"
                          ><i class="fa-solid fa-heart-pulse"></i
                        ></span>
                        <span class="contact_dot contact_dot_fav rounded-circle ${arr[i].favorite ? "d-flex" : "d-none"}"
                          ><i class="fa-solid fa-star"></i
                        ></span>
                      </div>
                      <div class="flex-grow-1 min-w-0 pt-1">
                        <h3>${arr[i].fullName}</h3>
                        <div class="d-flex align-items-center gap-2 mt-1">
                          <span class="contact_mini_icon bg_blue rounded-2"
                            ><i class="fa-solid fa-phone"></i
                          ></span>
                          <p class="mb-0">${arr[i].phone}</p>
                        </div>
                      </div>
                    </div>
                    <div class="contact_details mt-3">
                      <div class="d-flex align-items-center gap-2 mb-2">
                        <span
                          class="contact_mini_icon bg_violet_light rounded-2"
                          ><i class="fa-solid fa-envelope"></i
                        ></span>
                        <p class="mb-0">${arr[i].email}</p>
                      </div>
                      <div class="d-flex align-items-center gap-2">
                        <span
                          class="contact_mini_icon bg_emerald_light rounded-2"
                          ><i class="fa-solid fa-location-dot"></i
                        ></span>
                        <p class="mb-0">${arr[i].address}</p>
                      </div>
                    </div>
                    <div class="d-flex flex-wrap gap-2 mt-3">
                      <span class="badge_group ${arr[i].group} rounded-2"
                        >${arr[i].group}</span
                      >
                      <span class="badge_group badge_emer rounded-2 ${arr[i].emergency ? "d-flex" : "d-none"}"
                        ><i class="fa-solid fa-heart-pulse"></i> Emergency</span
                      >
                    </div >
                  </div >
      <div
        class="contact_card_foot d-flex align-items-center justify-content-between"
      >
        <div class="d-flex gap-2">
          <a
            href="tel:${arr[i].phone}"
            class="action_btn action_call rounded-3"
          ><i class="fa-solid fa-phone"></i
          ></a>
          <a
            href="mailto:${arr[i].email}"
            class="action_btn action_email rounded-3"
          ><i class="fa-solid fa-envelope"></i
          ></a>
        </div>
        <div class="d-flex gap-2">
          <button
            type="button"
            onclick="toggleFavorate(${conIndex})"
            class="action_btn action_fav  ${arr[i].favorite ? 'active' : ''} rounded-3"
          >
            <i class="fa-solid fa-star"></i>
          </button>
          <button
            type="button"
            onclick="toggleEmergency(${conIndex})"
            class="action_btn action_emer ${arr[i].emergency ? 'active' : ''} rounded-3"
          >
            <i class="fa-solid fa-heart-pulse"></i>
          </button>
          <button
           data-bs-toggle="modal"
              data-bs-target="#add_contact_modal"
            type="button"
            onclick="editContact(${conIndex})"
            class="action_btn action_edit rounded-3"
          >
            <i class="fa-solid fa-pen"></i>
          </button>
          <button
            type="button"
            class="action_btn action_del rounded-3"
            onclick="deleteContact(${conIndex})"
          >
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
                </div >
              </div > `

    if (arr[i].favorite) {
      favcartoona += `<a
                href="tel:${arr[i].phone}"
                class="side_item rounded-3 d-flex align-items-center gap-3"
              >
                <div
                  class="side_avatar bg_violet rounded-2 d-flex align-items-center justify-content-center"
                >
                  ${getinitials(arr[i].fullName)}
                </div>
                <div class="flex-grow-1 min-w-0">
                  <h4>${arr[i].fullName}</h4>
                  <p>${arr[i].phone}</p>
                </div>
                <span class="side_call rounded-2"
                  ><i class="fa-solid fa-phone"></i
                ></span>
              </a>`
    }
    if (arr[i].emergency) {
      emercartoona += `<a
                href="tel:${arr[i].phone}"
                class="side_item side_item_emer rounded-3 d-flex align-items-center gap-3"
              >
                <div
                  class="side_avatar bg_violet rounded-2 d-flex align-items-center justify-content-center"
                >
                  ${getinitials(arr[i].fullName)}
                </div>
                <div class="flex-grow-1 min-w-0">
                  <h4>${arr[i].fullName}</h4>
                  <p>${arr[i].phone}</p>
                </div>
                <span class="side_call side_call_emer rounded-2"
                  ><i class="fa-solid fa-phone"></i
                ></span>
              </a>`
    }
    contactsContainer.innerHTML = cartoona;
    favoriteContactsContainer.innerHTML = favcartoona;
    emergencyContactsContainer.innerHTML = emercartoona;
  }
}
function getinitials(name) {
  var nameParts = name.trim().split(" ")
  if (nameParts.length == 1) {
    return (nameParts[0][0])
  }
  var firstName = nameParts[0]
  var lastName = nameParts[nameParts.length - 1]
  return (firstName[0] + lastName[0])
}
function deleteContact(index) {



  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Deleted!",
        text: "The contact has been deleted.",
        icon: "success"
      }); contacts.splice(index, 1)
      displayContacts(contacts);
      localStorage.setItem("contacts", JSON.stringify(contacts));
    }
  });
}
function toggleEmergency(i) {
  contacts[i].emergency = !contacts[i].emergency
  displayContacts(contacts);
  localStorage.setItem("contacts", JSON.stringify(contacts));
}
function toggleFavorate(i) {
  contacts[i].favorite = !contacts[i].favorite
  displayContacts(contacts);
  localStorage.setItem("contacts", JSON.stringify(contacts));
}
function editContact(i) {
  fullNameInput.value = contacts[i].fullName;
  emailInput.value = contacts[i].email;
  phoneInput.value = contacts[i].phone;
  addressInput.value = contacts[i].address;
  groupInput.value = contacts[i].group;
  notesInput.value = contacts[i].notes;
  favoriteInput.checked = contacts[i].favorite;
  emergencyInput.checked = contacts[i].emergency;
  document.getElementById("updateContactBtn").classList.remove("d-none");
  document.getElementById("submitButton").classList.add("d-none");
  currentEditIndex = i;
}
function updateContact() {
  if (!validateName()) {
    Swal.fire({
      icon: "error",
      title: "Invalid Name",
      text: "Name should contain only letters and spaces (2-50 characters)",
    });
    return;
  }
  if (!validatePhone()) {
    Swal.fire({
      icon: "error",
      title: "Invalid Phone",
      text: "Please enter a valid Egyptian phone number (e.g., 01012345678 or +201012345678)",
    });
    return;
  }
  if (!validateEmail()) {
    return;
  }
  for (var i = 0; i < contacts.length; i++) {
    if (
      i !== currentEditIndex &&
      contacts[i].phone === phoneInput.value
    ) {
      Swal.fire({
        icon: "error",
        title: "Duplicate Phone Number",
        text: "A contact with this phone number already exists!",
      });
      return;
    }
  }

  contacts[currentEditIndex].fullName = fullNameInput.value;
  contacts[currentEditIndex].email = emailInput.value;
  contacts[currentEditIndex].phone = phoneInput.value;
  contacts[currentEditIndex].address = addressInput.value;
  contacts[currentEditIndex].group = groupInput.value;
  contacts[currentEditIndex].notes = notesInput.value;
  contacts[currentEditIndex].favorite = favoriteInput.checked;
  contacts[currentEditIndex].emergency = emergencyInput.checked;
  displayContacts(contacts);
  localStorage.setItem("contacts", JSON.stringify(contacts));
  closeContactModal()
  document.getElementById("updateContactBtn").classList.add("d-none");
  document.getElementById("submitButton").classList.remove("d-none");
  clearForm();

}
function searchContacts() {
  var searchArr = []
  for (let i = 0; i < contacts.length; i++) {
    if (contacts[i].fullName.toLowerCase().includes(searchInput.value.toLowerCase()) ||
      contacts[i].email.toLowerCase().includes(searchInput.value.toLowerCase()) ||
      contacts[i].phone.includes(searchInput.value)
    ) {
      searchArr.push(contacts[i])
    }

  }
  displayContacts(searchArr)

}
function validateName() {
  var nameRegex = /^[A-Za-z\u0621-\u064A\s]{2,50}$/u;
  if (!nameRegex.test(fullNameInput.value)) {
    nameError.classList.remove("d-none");
    return false;
  }
  nameError.classList.add("d-none");
  return true;
}
function validatePhone() {
  var phoneRegex = /^(?:01|\+201)\d{9}$/;
  if (!phoneRegex.test(phoneInput.value)) {
    phoneError.classList.remove("d-none");
    return false;
  }
  phoneError.classList.add("d-none");
  return true;
}
function validateEmail() {
  if (!emailInput.validity.valid) {
    emailError.classList.remove("d-none");
    return false;
  }

  emailError.classList.add("d-none");
  return true;
}
function closeContactModal() {
  var modalElement = document.getElementById("add_contact_modal");
  var modalInstance = bootstrap.Modal.getInstance(modalElement);
  modalInstance.hide();
}
function favCount() {
  var count = 0;
  for (var i = 0; i < contacts.length; i++) {
    if (contacts[i].favorite) {
      count++;
    }
  }
  return count;
}
function emerCount() {
  var count = 0;
  for (var i = 0; i < contacts.length; i++) {
    if (contacts[i].emergency) {
      count++;
    }
  }
  return count;
}
