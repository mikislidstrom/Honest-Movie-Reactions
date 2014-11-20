from erlport.erlterms import Atom
from erlport.erlang import set_message_handler, cast

def register_tweet(dest):
    def tweet(message):
        lines = []
        x = ''
        value = 0
        value_list = []
        with open("sentiment.txt") as f:
            lines = f.readlines()
            lines = [wordval.strip() for wordval in lines]
            for element in message:
                x = ''.join(chr(x) for x in element)
                for wordval in lines:
                    word = wordval[1:]
                    val = wordval[:1]
                    if x == word:
                        value_list.append(val)
                    else:
                        pass
            value_list = map(float, value_list)
            cast(dest, float(sum(value_list)/len(value_list)))
    set_message_handler(tweet)
    return Atom("ok")