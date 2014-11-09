var Character = function(obj) {
    this.properties = ['name', 'age', 'epoch', 'likes', 'dislikes'];
    for(var i = 0;i < this.properties.length; i++) {
        var property = this.properties[i];
        this[property] = obj[property];
    }
};

var beethoven = new Character(
    {name: 2, age: 52, epoch: 'classical',
        likes: [
            'classical',
            'symphony',
            'disabled',
            'sign',
            'language',
            'cleaning',
            'hygiene'
        ],
        dislikes: [
            'country',
            'pop',
            'guitar',
            'electronic',
            'dubstep',
            'lazy',
            'holiday',
            'landmark'
        ]});

FRIENDLY = 2;
POSITIVE = 1;
NEUTRAL = 0;
UNFRIENDLY = -1;

OPINION_LABELS = ['UNFRIENDLY', 'NEUTRAL', 'POSITIVE', 'FRIENDLY'];

/* calculates the emotional effect
   of player-inputed text to a character
   returns coeficient between -1:2
   -1 : unfrienly
   0: neutral
   1: positive
   2: friendly
   calls callback with the emotional effect
*/
function calculate_effect(character, input, callback) {
    if(COMMON_ENGLISH_WORDS[input]) {
        return NEUTRAL;
    }

    var page = load_wikipedia_page_words(input, function(page_words) {

        var like_effect = 0;
        var dislike_effect = 0;
        for(var i = 0;i < character.likes.length; i++) {
            var like = character.likes[i];
            console.log('LIKE?', like, page_words[like]);
            if(page_words[like] == true) {
                like_effect += 1;
            }
        }

        for(var i = 0;i < character.dislikes.length; i ++) {
            var dislike = character.dislikes[i];
            console.log('DISLIKE?', dislike, page_words[dislike]);
            if(page_words[dislike] == true) {
                dislike_effect += 1;
            }
        }    
    
        var raw_effect = like_effect - dislike_effect;
    
        var effect;
        if(raw_effect > 2) {
             effect = FRIENDLY;
        }
        else if(raw_effect > 0) {
            effect = POSITIVE;
        }
        else if(raw_effect == 0) {
            effect = NEUTRAL;
        }
        else {
            effect = UNFRIENDLY;
        }
        callback(effect);
    });
}
    
/* calculates if a like/dislike is important enough
   in a wiki page , that it changes the opinion of a 
   character about the player
*/
function load_wikipedia_page_words(input, callback) {
    //load wikipedia page
    //split words
    var e = "http://en.wikipedia.org/w/api.php?action=query&list=search&" +
              "format=json&srsearch=" + input + "&srprop=timestamp&callback=?";
    $.getJSON(e, function (data) {
        if(data.error) {
            return;
        }
        var winner = data.query.search[0].title;
       
        $.getJSON("http://en.wikipedia.org/w/api.php?action=query&titles=" + winner + 
                  "&prop=extracts&redirect=true&format=json&callback=?", function (data) {
            console.log(data);
            if(data.error) {
                console.log('wiki error');
                return;
            }
            var pages = data.query.pages;
            
            var data_dom = $(pages[Object.keys(pages)[0]].extract);
            //var data_dom = $(data.parse.text['*']);
            DATA = data_dom
            var text = data_dom.text();
            
            var words = text.split(/[\<\>\s]/);
        
            //console.log(text);
            words.push(text);
             
            var words_set = {};
            for(var i = 0; i < words.length; i ++) {
                var word = words[i].toLowerCase();

                if(!COMMON_ENGLISH_WORDS[word]) {
                    words_set[word] = true;
                }
            }
            wordsS = words_set
            console.log(words_set);
            callback(words_set);
        });            
    });
}
