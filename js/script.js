$(document).ready(function(){
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
          var latitude = position.coords.latitude;
          var longitude = position.coords.longitude;
          
          // Usando API de Geocode Reverso do OpenStreetMap para obter informações detalhadas de localização
          var url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
          $.getJSON(url, function(data) {
              var cidade = data.address.city || data.address.town || data.address.village || data.address.hamlet;
              var estado = data.address.state;
              var pais = data.address.country;

              var localizacao = "<ul>" +
                                      "<li><b>Cidade:</b> " + (cidade || 'N/A') + "</li>" +
                                      "<li><b>Estado:</b> " + (estado || 'N/A') + "</li>" +
                                      "<li><b>País:</b> " + (pais || 'N/A') + "</li>" +
                                      "<li><b>Latitude:</b> " + latitude + "</li>" +
                                      "<li><b>Longitude:</b> " + longitude + "</li>" +
                                  "</ul>";
                
              
              $('#localizacao').html(localizacao);
              
              $('#btn').click(function() {
                var mapUrl = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=15/${latitude}/${longitude}`;
                var emailContent = `Nova Localização:\n\n${localizacao}\n\nLink do mapa: ${mapUrl}`;
                
                  // Enviar e-mail usando EmailJS
                  var serviceID = 'service_s1kj6pp'; // Substitua pelo seu Service ID do EmailJS
                  var templateID = 'template_l40aacz'; // Substitua pelo seu Template ID do EmailJS
                  
                  // Configurar o EmailJS com sua chave pública
                  emailjs.init('dmcyCSlouymgq2U-m');
                    
                  // Enviar e-mail usando EmailJS
                  emailjs.send(serviceID, templateID, { message: emailContent })
                      .then(function(response) {
                          console.log('E-mail enviado com sucesso:', response);
                          alert('E-mail enviado com sucesso!');
                      }, function(error) {
                          console.error('Erro ao enviar e-mail:', error);
                          alert('Erro ao enviar e-mail. Por favor, tente novamente mais tarde.');
                      });
              });
          });
      }, function(error) {
          switch(error.code) {
              case error.PERMISSION_DENIED:
                  $('#localizacao').html("Permissão negada para acessar a localização.");
                  break;
              case error.POSITION_UNAVAILABLE:
                  $('#localizacao').html("Informações de localização estão indisponíveis.");
                  break;
              case error.TIMEOUT:
                  $('#localizacao').html("A solicitação para obter a localização do usuário expirou.");
                  break;
              case error.UNKNOWN_ERROR:
                  $('#localizacao').html("Ocorreu um erro desconhecido ao tentar obter a localização do usuário.");
                  break;
          }
      });
  } else {
      $('#localizacao').html("Geolocalização não é suportada por este navegador.");
  }
});