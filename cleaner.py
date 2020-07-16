# notion-enhancer
# (c) 2020 dragonwocky <thedragonring.bod@gmail.com>
# (c) 2020 TarasokUA
# (https://dragonwocky.me/) under the MIT license

import os
import sys
import platform
import subprocess
from shutil import rmtree
from time import sleep

# f'{bold}=== title ==={normal}'    = headers
# '*'                               = information
# '...'                             = actions
# '###'                             = warnings
# '>'                               = exit

bold = '\033[1m'
normal = '\033[0m'

print(f'{bold}=== NOTION ENHANCER CLEANING LOG ==={normal}\n')
try:
    filepath = ''
    if 'microsoft' in platform.uname()[3].lower() and sys.platform == 'linux':
        filepath = '/mnt/c/' + \
                   subprocess.run(
                       ['cmd.exe', '/c', 'echo', '%localappdata%'], stdout=subprocess.PIPE).stdout \
                       .rstrip().decode('utf-8')[3:].replace('\\', '/') + '/Programs/Notion/resources'
    elif sys.platform == 'win32':
        filepath = subprocess.run(['echo', '%localappdata%'], shell=True, capture_output=True).stdout \
                       .rstrip().decode('utf-8') + '\\Programs\\Notion\\resources'
    elif sys.platform == 'linux':
        filepath = '/opt/notion-app' if os.path.exists(
            '/opt/notion-app') else '/opt/notion'
    elif sys.platform == 'darwin':
        filepath = '/Applications/Notion.app/Contents/Resources'
    else:
        print(' > script not compatible with your os!\n   (report this to dragonwocky#8449 on discord)')
        exit()

    if os.path.exists(os.path.join(filepath, 'app')):
        print(
            f' ...removing folder {os.path.join(filepath, "app")}')
        rmtree(os.path.join(filepath, 'app'))
    else:
        print(
            f' * {os.path.join(filepath, "app")} was not found: step skipped.')

    if os.path.isfile(os.path.join(filepath, 'app.asar.bak')):
        print(' ...renaming asar.app.bak to asar.app')
        os.rename(os.path.join(filepath, 'app.asar.bak'),
                  os.path.join(filepath, 'app.asar'))
    else:
        print(
            f' * {os.path.join(filepath, "app.asar.bak")} was not found: step skipped.')

    if sys.platform == 'linux' and 'microsoft' not in platform.uname()[3].lower():
        pathlist = ['/usr/bin/notion-app', '/usr/bin/notion', '/opt/notion-app/notion-app']
        # get all the possible paths where the launcher may be located
        for path in pathlist:
            if os.path.exists(path):
                with open(path, 'r', encoding='UTF-8') as launcher:
                    contents = launcher.read()
                    if 'app.asar' not in contents:
                        print(f' ...patching app launcher in {path}')
                        subprocess.call(['sed', '-i', r's/electron6\ app/electron6\ app\.asar/', path])

    print(f'\n{bold}>>> SUCCESSFULLY CLEANED <<<{normal}')

except Exception as e:
    print(f'\n{bold}### ERROR (report this to dragonwocky#8449 on discord) ###{normal}\n{str(e)}')

print(f'\n{bold}=== END OF LOG ==={normal}')
