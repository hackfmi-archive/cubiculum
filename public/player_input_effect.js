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
            'classical music',
            'symphony',
            'disabled',
            'sign language',
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

        for(var i = 0;i < character.likes.lenth; i ++) {
            var like = character.likes[i];
            if(page_words[like] == true) {
                like_effect += 1;
            }
        }

        for(var i = 0;i < character.dislikes.lenth; i ++) {
            var dislike = character.dislikes[i];
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
    $.getJSON("http://en.wikipedia.org/w/api.php?action=parse&page=" + input + 
              "&prop=text&section=all&format=json&callback=?", function (data) {
        var words = [];
        for (text in data.parse.text) {
            var text = data.parse.text[text].split("/<.>/");
            // var pText = "";
            // for (p in text) {
            //     //Remove html comment
            //     text[p] = text[p].split("<!--");
            //     if (text[p].length > 1) {
            //         text[p][0] = text[p][0].split(/\r\n|\r|\n/);
            //         text[p][0] = text[p][0][0];
            //         text[p][0] += "</p> ";
            //     }
            //     text[p] = text[p][0];
            //     //Construct a string from paragraphs
            //     if (text[p].indexOf("</p>") == text[p].length - 5) {
            //         var htmlStrip = text[p].replace(, '') //Remove HTML
            //         debugger;
            //         var splitNewline = htmlStrip.split(/\r\n|\r|\n/); //Split on newlines
            //         for (newline in splitNewline) {
            //             if (splitNewline[newline].substring(0, 11) != "Cite error:") {
            //                 pText += splitNewline[newline];
            //                 pText += "\n";
            //             }
            //         }
            //     }
            // }
            // pText = pText.substring(0, pText.length - 2); //Remove extra newline
            // pText = pText.replace(/\[\d+\]/g, ""); //Remove reference tags (e.x. [1], [4], etc)
            // console.log(pText)
            console.log(text);
            words.push(text);
            console.log(2);
        }    
        var words_set = {};
        for(var i = 0; i < words.length; i ++) {
            if(COMMON_ENGLISH_WORDS[words[i]]) {
                words_set[words[i]] = true;
            }
        }
        callback(words_set);
    });
}
