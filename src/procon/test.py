from pyjoycon import JoyCon, get_L_id, get_R_id

joycon_id = get_L_id()

if joycon_id[0] is None:
    print('{"err":"joy-con not found."}')
else:
    joycon = JoyCon(*joycon_id)

    while True:
       print(joycon.get_status())