// Configuration
const connToken = "90934726|-31949208479252495|90955788";
const dbName = "Project";
const relName = "Project-rel";
const jpdbBaseURL = "http://api.login2explore.com:5577";
const jpdbIML = "/api/iml";
const jpdbIRL = "/api/irl";

$("#rollNo").focus();

function saveData() {
  let jsonStrObj = validateAndGetFormData();
  if (jsonStrObj === "") {
    return;
  }

  let putRequest = createPUTRequest(connToken, jsonStrObj, dbName, relName);
  jQuery.ajaxSetup({ async: false });
  executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
  jQuery.ajaxSetup({ async: true });

  alert("Record Saved Successfully!");
  resetForm();
}

function updateData() {
  let jsonStrObj = validateAndGetFormData();
  if (jsonStrObj === "") {
    return;
  }

  let recNo = localStorage.getItem("recno");
  if (recNo == null) {
    alert("Record not found in localStorage.");
    return;
  }

  let updateRequest = createUPDATERecordRequest(connToken, jsonStrObj, dbName, relName, recNo);
  jQuery.ajaxSetup({ async: false });
  executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
  jQuery.ajaxSetup({ async: true });

  alert("Record Updated Successfully!");
  resetForm();
}

function getRollNo() {
  let rollNoVal = $("#rollNo").val();

  if (rollNoVal === "") {
    resetForm();
    return;
  }

  let jsonObj = { rollNo: rollNoVal };

  let getRequest = createGET_BY_KEYRequest(connToken, dbName, relName, JSON.stringify(jsonObj));
  jQuery.ajaxSetup({ async: false });
  let resultObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
  jQuery.ajaxSetup({ async: true });

  if (resultObj.status === 400) {
    $("#save").prop("disabled", false);
    $("#reset").prop("disabled", false);
    enableFields();
    $("#fullName").focus();
  } else if (resultObj.status === 200) {
    $("#rollNo").prop("disabled", true);
    fillData(resultObj);
    $("#update").prop("disabled", false);
    $("#reset").prop("disabled", false);
    enableFields();
    $("#fullName").focus();
  }
}

function fillData(resultObj) {
  let data = JSON.parse(resultObj.data).record;

  localStorage.setItem("recno", data.rec_no);
  console.log("Record number stored: " + data.rec_no);

  $("#fullName").val(data.fullName || "");
  $("#class").val(data.class || "");
  $("#birthDate").val(data.birthDate || "");
  $("#address").val(data.address || "");
  $("#enrollmentDate").val(data.enrollmentDate || "");
}

function validateAndGetFormData() {
  let rollNoVar = $("#rollNo").val();
  let fullNameVar = $("#fullName").val();
  let classVar = $("#class").val();
  let birthDateVar = $("#birthDate").val();
  let addressVar = $("#address").val();
  let enrollmentDateVar = $("#enrollmentDate").val();

  if (rollNoVar === "") { alert("Roll No is required!"); $("#rollNo").focus(); return ""; }
  if (fullNameVar === "") { alert("Full Name is required!"); $("#fullName").focus(); return ""; }
  if (classVar === "") { alert("Class is required!"); $("#class").focus(); return ""; }
  if (birthDateVar === "") { alert("Birth Date is required!"); $("#birthDate").focus(); return ""; }
  if (addressVar === "") { alert("Address is required!"); $("#address").focus(); return ""; }
  if (enrollmentDateVar === "") { alert("Enrollment Date is required!"); $("#enrollmentDate").focus(); return ""; }

  let jsonStrObj = {
    rollNo: rollNoVar,
    fullName: fullNameVar,
    class: classVar,
    birthDate: birthDateVar,
    address: addressVar,
    enrollmentDate: enrollmentDateVar,
  };

  return JSON.stringify(jsonStrObj);
}

function resetForm() {
  $("#rollNo").val("");
  $("#fullName").val("");
  $("#class").val("");
  $("#birthDate").val("");
  $("#address").val("");
  $("#enrollmentDate").val("");

  $("#rollNo").prop("disabled", false);
  disableFields();

  $("#save").prop("disabled", true);
  $("#update").prop("disabled", true);
  $("#reset").prop("disabled", true);

  $("#rollNo").focus();
}

function enableFields() {
  $("#fullName").prop("disabled", false);
  $("#class").prop("disabled", false);
  $("#birthDate").prop("disabled", false);
  $("#address").prop("disabled", false);
  $("#enrollmentDate").prop("disabled", false);
}

function disableFields() {
  $("#fullName").prop("disabled", true);
  $("#class").prop("disabled", true);
  $("#birthDate").prop("disabled", true);
  $("#address").prop("disabled", true);
  $("#enrollmentDate").prop("disabled", true);
}
