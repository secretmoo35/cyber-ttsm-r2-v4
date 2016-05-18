(function(global) {
    var app = global.app = global.app || {};

    app.configService = {
        // serviceUrl: 'https://ttsm.ais.co.th/TTSMWeb/rest-service/', //TTSM production
        // serviceUrl: 'https://ttsdev.ais.co.th:8543/TTSMWeb/rest-service/',//TTSDEV
        serviceUrl: 'https://10.104.240.71/TTSMWeb/rest-service/',//TTSDEV-UPDATE 2016/05/18
        // serviceUrl: 'http://10.252.164.169:8780/TTSMWeb/rest-service/',
        // serviceUrl: 'http://10.252.66.40:8780/TTSMWeb/rest-service/',//TTEME
        // 
        // fingerprint: 'E5 32 A9 68 C6 E2 51 54 3B 6A E9 5D 1C 34 22 8D 51 DD 56 B3',//TTSDEV
        // fingerprint: '4c e9 58 42 0f 63 c7 e0 b1 ed 8d 50 f3 c9 c0 aa d6 14 08 b4', //TTSM production
        fingerprint: '3e ad 99 09 59 97 21 65 87 df f6 e0 08 de 6a bc b0 24 46 2c', //TTSDEV-UPDATE 2016/05/18
        version: "2.1.2",
        //downloadVersionPath : "http://rss.ais.co.th/mobileappdep/TTS_Mobility/",//TTSDEV
        downloadVersionPath: "http://rss.ais.co.th/mobileappdep/TTS_Mobility/", //TTSPROD
        //timeout: 120000,

        timeout: 3600000,
        pinCluster: false,
        isMorkupData: false
    };
})(window);
