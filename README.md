# LANraragi - Auto turning page

Script to add auto turning page function to LANraragi Reader.

This project is not official to LANraragi.


## Getting Started <a name = "getting_started"></a>

This script is a userscript.
You need a web browser extension or application that can run userscripts.

### Prerequisites

This script has currently only been tested with the Tampermonkey extension.

It may not work properly with other extensions and applications.

I will update the content once testing with other extensions and applications is complete.

> [!NOTE]
> AdGuard has confirmed that the script is not working properly.


### Installing

#### Quick Install

Click this URL : https://awesomevodka.github.io/LANraragi-Auto-turrning-page/auto_turning_page.user.js

#### Tempermonkey

1. Go to Dashboard
2. Click 'Utilities' tab
3. Enter the following URL in the text field of the 'Import from URL' item and click the 'Install' button.
```
https://awesomevodka.github.io/LANraragi-Auto-turrning-page/auto_turning_page.user.js
```

## Usage <a name = "usage"></a>

When you access the LANraragi reader page with the script installed, a play icon button will be added to the top right and bottom.

![image](https://github.com/user-attachments/assets/b9c97f98-d98c-40d6-b716-54608cbeb24c)

Clicking the play icon button will switch to full screen mode. After that, it will automatically move to the next page every 8 seconds.

After 8 seconds of reaching the last page, full screen mode is disabled and stop automatic page turning.

If you want to stop page turning before reaching the last page, click the stop button in the upper right corner. This will exit full screen mode and automatic page turning.

![image](https://github.com/user-attachments/assets/6397aa5b-1d9e-4e73-9eac-45a40b5e1c03)

Alternatively, you can manually exit full screen mode and click the stop icon button in the place of the play icon button, and the stop icon will change to a play icon, stop automatic page turning.

![image](https://github.com/user-attachments/assets/cafb1b33-bc3a-4d36-b290-99967b48b85f)


You can change the page turning interval (turn after n seconds) and whether to run automatic full screen mode. To change these settings, click the 'Reader Settings' button (gear icon button) at the top and bottom left of the reader page to open the settings popup.

![image](https://github.com/user-attachments/assets/dd98ba51-b046-49b1-9271-5ae08c5de6bb)


There are two settings items added at the bottom of the pop-up, with the title starting with 'Auto turning page'.

![image](https://github.com/user-attachments/assets/73be925a-3789-4086-a0d5-e859e3724f9f)


The 'Auto turning page - Seconds interval' item allows you to set how many seconds the page will turn.

The 'Auto turning page - Use fullscreen' item allows you to set whether to automatically activate full screen mode when performing automatic page turning.

For detailed information on each setting, please refer to the guidance text below the title.
