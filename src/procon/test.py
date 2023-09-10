from pyjoycon import JoyCon, get_L_id, get_R_id
import time

joycon_id = get_L_id()
joycon = JoyCon(*joycon_id)

while (True):
    time.sleep(0.1)
    print(joycon.get_status())