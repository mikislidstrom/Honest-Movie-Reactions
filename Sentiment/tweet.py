from erlport.erlterms import Atom
from erlport.erlang import set_message_handler, cast

def register_tweet(dest):
    def tweet(message):
        lines = []
        x = ''
        value = 0
        value_list = [0]
        with open("sentiment.txt") as f:
            lines = f.readlines()
            lines = [word.strip() for word in lines]
            for element in message:
                x = ''.join(chr(x) for x in element)
                for word in lines:
                    wordz = word[1:]
                    val = word[:1]
                    if x == wordz:
                        value_list.append(val)
                    else:
                        pass
            value_list = map(float, value_list)
            s = sum(value_list)
            l = len(value_list)
            m = float(s/l)
            cast(dest, m)
    set_message_handler(handler)
    return Atom("ok")