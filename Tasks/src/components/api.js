export async function signData(username, email, password) {
    const data = {
      username,
      email,
      password,
      xp: "0",
      role: "USER"
    };
  
    try {
      const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to register: ${response.status} ${errorText}`);
      }
  
      const result = await response.json();  // ✅ Expecting { token: "..." }
      console.log('JWT:', result.token);
      localStorage.setItem("authToken",result.token)

      return result.token;
    } catch (err) {
      console.error('Error:asdasd', err.message);
    }
  }
// 📁 api.js
export async function loginUser(email, password) {
    try {
        const data={email,password}
        const response = await fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            credentials: 'include'    // ✅ Include cookies
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed');
        }
        const result = await response.json();


        console.log('✅ Login successful');
        localStorage.setItem("authToken",result.token)

        return result.token;
    } catch (error) {
        console.error('❌ Errorasdsad:', error.message);
        throw error;
    }
}
export async function fetchToken() {
    try {
        const response = await fetch('http://localhost:3000/api/get-token', {
            method: 'GET',
            credentials: 'include'   // ✅ Include cookies
        });

        if (!response.ok) {
            throw new Error('Failed to fetch token');
        }

        const data = await response.json();
        console.log('✅ Token:', data.token);   // Log the token
        return data.token;  
    } catch (error) {
        console.error('❌ Error fetching token:', error.message);
        return null;
    }
}