(function(global) {
    var app = global.app = global.app || {};

    app.configService = {
        //serviceUrl: 'https://ttsm.ais.co.th/TTSMWeb/rest-service/', //TTSM production
        // serviceUrl: 'https://ttsdev.ais.co.th:8543/TTSMWeb/rest-service/',//TTSDEV
        serviceUrl: 'http://10.252.66.40:8780/TTSMWeb/rest-service/',//TTEME
        fingerprint: 'E5 32 A9 68 C6 E2 51 54 3B 6A E9 5D 1C 34 22 8D 51 DD 56 B3',//TTSDEV
        //fingerprint: '4c e9 58 42 0f 63 c7 e0 b1 ed 8d 50 f3 c9 c0 aa d6 14 08 b4', //TTSM production
        version: "2.1.1",
        //downloadVersionPath : "http://rss.ais.co.th/mobileappdep/TTS_Mobility/",//TTSDEV
        downloadVersionPath: "http://rss.ais.co.th/mobileappdep/TTS_Mobility/", //TTSPROD
        //timeout: 120000,

        timeout: 3600000,
        pinCluster: false,
        isMorkupData: false
    };
})(window);
