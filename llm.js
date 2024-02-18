const axios = require('axios');



async function send_to_aura(messages){
    const options = {
        method: 'POST',
        url: 'https://gpts4u.p.rapidapi.com/llama2',
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': '7a56fc7a42mshd36588efbcf3531p1bc1c5jsn5694f816fe01',
          'X-RapidAPI-Host': 'gpts4u.p.rapidapi.com'
        },
        data:messages
      };
try {
	const response = await axios.request(options);
	return response.data;
} catch (error) {
	console.error(error);
}
}


  
module.exports = send_to_aura