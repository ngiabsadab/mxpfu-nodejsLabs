const express = require('express');
const router = express.Router();


let users = [
  {
    firstName: "John",
    lastName: "wick",
    email: "johnwick@gamil.com",
    DOB: "22-01-1990",
  },
  {
    firstName: "John",
    lastName: "smith",
    email: "johnsmith@gamil.com",
    DOB: "21-07-1983",
  },
  {
    firstName: "Joyal",
    lastName: "white",
    email: "joyalwhite@gamil.com",
    DOB: "21-03-1989",
  },
  // {
  //   firstName: "Woody",
  //   lastName: "mansome",
  //   email: "woody_dev@gmail.com",
  //   DOB: "09-02-1999",
  // },
];

// GET request: Retrieve all users
router.get("/", (req, res) => {
  // res.send(users);
  // Send a JSON response containing the users array, formatted with an indentation of 4 spaces for readability
  res.send(JSON.stringify(users, null, 4));
});


// Function to convert a date string in the format "dd-mm-yyyy" to a Date object
function getDateFromString(strDate) {
  let [dd, mm, yyyy] = strDate.split('-');
  return new Date(yyyy + "/" + mm + "/" + dd);
}

// Define a route handler for GET requests to the "/sort" endpoint
router.get("/sort", (req, res) => {
  // Sort the users array by DOB in ascending order
  let sorted_users = users.sort(function (a, b) {
    let d1 = getDateFromString(a.DOB);
    let d2 = getDateFromString(b.DOB);
    return d1 - d2;
  });
  // Send the sorted_users array as the response to the client
  // res.send(sorted_users);
  // res.send(users);
  res.send(JSON.stringify(sorted_users, null, 4));
});

// GET by specific ID request: Retrieve a single user with email ID
router.get("/:email", (req, res) => {

  // Extrac the email parameter from the request URL
  const email = req.params.email;

  // Filter the users array to find users whose email matches the extracted email parameter
  const filtered_users = users.filter((user) => user.email === email);

  if (filtered_users.length === 0) {
    res.status(404).send("User not found");
  } else {

    // Send the filtered_users array as the response to the client
    res.send(filtered_users);
  }

});

router.get("/lastName/:lastName", (req, res) => {
  // Extract the lastName parameter from the request URL
  const lastName = req.params.lastName;
  // Filter the users array to find users whose lastName matches the extracted lastName parameter
  let filtered_lastname = users.filter((user) => user.lastName === lastName);
  // Send the filtered_lastname array as the response to the client
  res.send(filtered_lastname);
});





// POST request: Create a new user
router.post("/", (req, res) => {
  // Push a new user object to the users array based on query parameters from the request UR:
  users.push({
    'firstName': req.query.firstName,
    'lastName': req.query.lastName,
    'email': req.query.email,
    'DOB': req.query.DOB
  });

  res.send('The user ' + req.query.firstName + ' has been added to the database!');
});
// curl --request POST 'localhost:5001/user?firstName=Jon&lastName=Lovato&email=jonlovato@theworld.com&DOB=10/10/1995'

// PUT request: Update the details of a user by email ID
router.put("/:email", (req, res) => {
  // Extract email parameter and find users with matching email
  const email = req.params.email;
  let filtered_users = users.filter((user) => user.email === email);
  if (filtered_users.length > 0) {

    // Select the first maching user and update attributes if provided
    const fitered_user = filtered_users[0];

    // Extract and update DOB if provided in the request URL
    let DOB = req.query.DOB;
    if (DOB) {
      fitered_user.DOB = DOB;
    }

    // Extract and update firstName if provided in the request URL
    if (req.query.firstName) {
      fitered_user.firstName = req.query.firstName;
    }

    // Extract and update lastName if provided in the request URL
    if (req.query.lastName) {
      fitered_user.lastName = req.query.lastName;
    }

    // Replace old user entry wuth updated user
    users = users.filter((user) => user.email != email);
    users.push(fitered_user);

    // Send success message indicating the user has been updated
    res.send(`User with the email ${email} has been updated`);
  } else {
    res.send('Unable to find user!!!');
  }

});

// curl --request PUT 'localhost:5001/user/johnsmith@gamil.com?DOB=1/1/1971'
// curl localhost:5001/user/johnsmith@gamil.com



// DELETE request: Delete a user by email ID
router.delete("/:email", (req, res) => {
  // Extract the email parameter from the request URL
  const email = req.params.email;
  // Filter the users array to exclude the user with the specified email
  users = users.filter((user) => user.email != email);
  // Send a success message as the response, indicating the user has been deleted
  res.send(`User with the email ${email} deleted.`);
});

// curl --request DELETE 'localhost:5001/user/johnsmith@gamil.com'


module.exports = router;
