(function(global) {
    var app = global.app = global.app || {};

    app.configService = {
        // serviceUrl: 'https://ttsm.ais.co.th/TTSMWeb/rest-service/', //TTSM production
        // serviceUrl: 'https://ttsdev.ais.co.th:8543/TTSMWeb/rest-service/',//TTSDEV
        serviceUrl: 'https://10.104.240.71/TTSMWeb/rest-service/',//TTSDEV-UPDATE 2016/05/18
        // serviceUrl: 'http://10.252.164.169:8780/TTSMWeb/rest-service/',
        // serviceUrl: 'http://10.252.66.40:8780/TTSMWeb/rest-service/',//TTEME
        // serviceUrl: 'https://10.104.244.179/TTSMWeb/rest-service/',//TTSSTAGING 2016/08/23
        // 
        // fingerprint: 'E5 32 A9 68 C6 E2 51 54 3B 6A E9 5D 1C 34 22 8D 51 DD 56 B3',//TTSDEV
        // fingerprint: '4c e9 58 42 0f 63 c7 e0 b1 ed 8d 50 f3 c9 c0 aa d6 14 08 b4', //TTSM production
        // fingerprint: 'DD 9A DC BC 03 C5 22 1C 0E 53 B4 9B E5 57 ED F2 E9 3C 31 66', //TTSM production 2016/07/21
        fingerprint: '3e ad 99 09 59 97 21 65 87 df f6 e0 08 de 6a bc b0 24 46 2c', //TTSDEV-UPDATE 2016/05/18
        // fingerprint: '07 1F 33 DF 9D 93 BC 43 D9 80 12 47 98 59 EF FF 7E AD 91 D2', //TTSSTAGING 2016/08/23
        version: "2.1.3",
        //downloadVersionPath : "http://rss.ais.co.th/mobileappdep/TTS_Mobility/",//TTSDEV
        downloadVersionPath: "http://rss.ais.co.th/mobileappdep/TTS_Mobility/", //TTSPROD
        //timeout: 120000,

        timeout: 3600000,

        
        pinCluster: false,
        isMorkupData: false
    };
})(window);
