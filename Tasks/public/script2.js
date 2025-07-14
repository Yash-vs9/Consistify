async function fetchAndInitializeBotpress() {
  const response = await fetch("https://files.bpcontent.cloud/2025/02/06/14/20250206142548-WJWVT1YO.json");
  const data = await response.json();
  const id = data.clientId;

  return id; // This is returned as a Promise
}
const fetchEmail=(async()=>{
  const response=fetch("",{
    method:"GET",
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  })
  if(!response.ok){
    const errorData=(await response).json()
    const err=errorData.error
    console.log(err)
  }
  const data=await response.json()
  return data
})
const email=fetchEmail()

// const fetchLogin = async function (email, password) {
//   const e = email;
//   const pw = password;
//   console.log(e);
//   console.log(pw);
//   return { e, pw };
// }

// Example of how to use it
async function initializeBot(email, password) {
  const cId = await fetchAndInitializeBotpress(); // Await the result of the promise
 // Now you can use cId in your Botpress initialization

  // Get login details
  // const { e, pw } = await fetchLogin(email, password); // Await fetchLogin to get email and password

  // You can now use cId and login details in your Botpress initialization:
  window.botpress.init({
    "botId": "0b639e72-ebb2-471f-9430-18aa97f879b4",
    "configuration": {
      "botName": "Chat Bot",
      "website": {},
      "email": {},
      "phone": {},
      "termsOfService": {},
      "privacyPolicy": {},
      "color": "#3B82F6",
      "variant": "solid",
      "themeMode": "dark",
      "fontFamily": "inter",
      "radius": 1
    },
    "clientId": cId,  // Use the fetched cId
    "user": {
      "data": {
        "useremail": email, // Use the email from fetchLogin
        // Use the password from fetchLogin
      }
    }
  });
}

// Call the initialization function with your email and password
initializeBot(email);