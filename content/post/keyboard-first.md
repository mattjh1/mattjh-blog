---
title: "Keyboard First"
date: "2024-11-25"
description: "A deep dive into building a keyboard-first workflow on macOS using Karabiner, Hammerspoon, Vimium, and more."
tags:
  - karabiner
  - hammerspoon
  - homerow
  - Vimium
categories:
  - productivity
  - tools
---

The way we interface with computers with keyboard and mouse is really slow, even if you're super fast with the keyboard it is impossible to keep up with the brain. But, it is as good as it gets (for now)... The mouse on the other hand is evil! Wherever possible, replacing a mouse move with a keyboard shortcut saves your wrists and is more efficient, at least from my perspective, a pro FPS gamer or a video editor would likely disagree, but this is a tech oriented blog.

<!--more-->

{{< image src="DALL-E-keyboard2.webp" alt="Dall-E generated 'keyboard first' image" center=true max-width="100%" caption="Dall-E generated image" >}}

I've made multiple posts going over the power of Vim, and this post will not be another one of those albeit we might inevitably get into it briefly. This will be more about additional tools that can be used to create a keyboard friendly environment on macOS. I've also went onto replicating my setup on my Linux based system, but that will have to wait for a future post.

---

So, enough about Linux, lets talk about some cool macOS tools that will help you achieve a keyboard centric workflow. For starters I want to give a shout-out to [Jason Rudolph](https://github.com/jasonrudolph) and his [keyboard project](https://github.com/jasonrudolph/keyboard) which was the enabler that opened my eyes to a keyboard centric approach to interacting with my computer. In this project he speaks about creating a useful keyboard experience everywhere, its not just tweaking the binds for some application but make system-wide changes that makes sense. Lets go through some of these great tools, starting wtih Karabiner-Elements.

## Karabiner-Elements

Karabiner-Elements is a great utility tool for customizing keyboards via software. It works by defining rules in the shape of JSON objects, these rules tells karabiner to change keyboard behaviour according to the specification. It has a large community so there are tons of predefined rules to pick and choose from. I used to use this more extensively before finding out about Jason's plug and play solution, which incorporates Karabiner-Elements but rely heavily on Hammerspoon as well.

I use it primarily for the cool (S)uper (D)uper mode as he calls it. Essentially what it does is make holding down the keys S and D simultaneously unlock a new layer on the keyboard. No more reaching for the arrow keys EVER. Because now, even in apps with no Vim support you can navigate using `sd+h/j/k/l`, there is more stuff to it but this is the primary benefit I get out of it. I can use h/j/k/l when I'm forced to interact with ms office tools for work.

I used to use it to bind caps-lock to escape but wait til you see how this is done in Hammerspoon...

## Hammerspoon

Hammerspoon is a macOS specific automation tool, essentially it is a bridge between the operating system and a Lua scripting engine. As you can understand this program can achieve far more than just setting global keybinds, but thats what we'll be covering.

Hammerspoon is made up of small atomic pieces that solves specific problems, you can either write your own using the API or pick and choice from a vast selection of "Spoons" as they're called.

Personally i use Hammerspoon for a few things.

### Control-Escape

As mentioned before I changed from using Karabiner-Elements to use Hammerspoon, and this solution does more than just swap caps-lock to escape. If caps-lock is pressed and held down, the button acts as ctrl. If the button is tapped it acts as escape, so essentially it is two buttons merged into one, and its one of the most accessible keys on the keyboard, it is a thing of beauty really.

Have a look at the wonderful code snippet that makes this possible:

```lua
-- Credit for this implementation goes to @arbelt and @jasoncodes 🙇⚡️😻
--
--   https://gist.github.com/arbelt/b91e1f38a0880afb316dd5b5732759f1
--   https://github.com/jasoncodes/dotfiles/blob/ac9f3ac/hammerspoon/control_escape.lua

sendEscape = false
lastMods = {}

ctrlKeyHandler = function()
  sendEscape = false
end

ctrlKeyTimer = hs.timer.delayed.new(0.15, ctrlKeyHandler)

ctrlHandler = function(evt)
  local newMods = evt:getFlags()
  if lastMods["ctrl"] == newMods["ctrl"] then
    return false
  end
  if not lastMods["ctrl"] then
    lastMods = newMods
    sendEscape = true
    ctrlKeyTimer:start()
  else
    if sendEscape then
      keyUpDown({}, 'escape')
    end
    lastMods = newMods
    ctrlKeyTimer:stop()
  end
  return false
end

ctrlTap = hs.eventtap.new({hs.eventtap.event.types.flagsChanged}, ctrlHandler)
ctrlTap:start()

otherHandler = function(evt)
  sendEscape = false
  return false
end

otherTap = hs.eventtap.new({hs.eventtap.event.types.keyDown}, otherHandler)
otherTap:start()
```

### Hyper Key

I can only refer to the hyper key as a hidden gem within your keyboard, that can only be found by those who seek. The hyper key is simply another completely untapped modifier key that you can enable, on a keyboard you have modifiers like ctrl, shift, alt (option), super (cmd). Combination are also not uncommon, like ctrl+shift or alt+shift.

Maybe there is even some application crazy enough to use triple modifier combos, but sure as shit there is none that use four. And that is what the hyper key is, ctrl+shift+alt+super, unless you're a mutant of some kind you'll find it extremely hard to use this modifier. There is a solution to this, with ctrl now bound to caps-lock we have a unbound modifier, the original ctrl.

I use this button for two main things:

1. Quickly change between apps
2. Enable window change mode, e.g., resize/move windows

When I researched window tiling managers for mac I did not really like what I found. i3 on Linux is much more to my liking, and if that was available I would consider using that instead. My research was awhile ago but things might have changed, for full featured [yabai](rttps://github.com/koekeishiya/yabai) you need to disable System Integrity Protection (SIP), which is a big no-no. And even if I wanted to I wouldn't be able to on my corporate managed laptop.

So without further ado, lets rebind ctrl+shift+alt+super to simply ctrl!

```lua
local status, hyperModeAppMappings = pcall(require, "scripts.hyper-apps")

if not status then
	hyperModeAppMappings = require("scripts.hyper-apps")
end

for i, mapping in ipairs(hyperModeAppMappings) do
	local key = mapping[1]
	local app = mapping[2]
	hs.hotkey.bind({ "shift", "ctrl", "alt", "cmd" }, key, function()
		if type(app) == "string" then
			hs.application.open(app)
		elseif type(app) == "function" then
			app()
		else
			hs.logger.new("hyper"):e("Invalid mapping for Hyper +", key)
		end
	end)
end

```

### Hyper Apps

Lets also take a look at `scripts.hyper-apps`, with this setup I very rarely stretch to use the very clunky action of tabbing through applications.

```lua
return {
	---  { 'a' } RESERVED FOR WINDOW MANAGEMENT
	--
	{ "w", "Microsoft Edge" }, -- "W" for "Web Browser"
	-- { "w", "Google Chrome" }, -- "W" for "Web Browser"
	-- { "w", "Safari" }, -- "W" for "Web Browser"
	-- { "w", "Firefox" }, -- "W" for "Web Browser"
	-- { "w", "Brave Browser" }, -- "W" for "Web Browser"
	--
	-- { "c", "Hub | Microsoft Teams" }, -- "C" for "Chat" use for Teams PWA app
	{ "c", "Microsoft Teams" },   -- "C" for "Chat" use for Teams app
	{ "e", "Visual Studio Code" }, -- "E" for "Editor"
	{ "f", "Finder" },            -- "F" for "Finder"
	{ "v", "Obsidian" },          -- "F" for "Finder"
	{ "o", "Microsoft Outlook" }, -- "O" for "Outlook"
	{ "s", "Spotify" },           -- "S" for "Spotify"
	{ "t", "Alacritty" },         -- "T" for "Terminal"
	{ "m", "Messages" },          -- "M" for "Messages"
	{ "d", "Discord" },           -- "D" for "Discord"
	{ "b", "DBeaver" },           -- "B" for "Beaver"
	{ "n", "Neo4j Desktop" },     -- "N" for "Neo4j"
	{ "p", "1Password" },         -- "P" for "Password"
	{ "g", "Citrix Viewer" },     -- "G" for "Gitrix Viewer" :)
}
```

### Hyper Windows

hyper+a opens window manipulation mode, essentially a layer where each key get a new meaning as long as the layer is active. Much like a mode in vi.

```lua
return {
  modifiers = {'ctrl', 'shift', 'alt', 'cmd'},
  showHelp  = true,
  trigger   = 'a',
  mappings  = {
    { {},         'return', 'maximize' },
    { {},         'space',  'centerWithFullHeight' },
    { {},         'h',      'left' },
    { {},         'j',      'down' },
    { {},         'k',      'up' },
    { {},         'l',      'right' },
    { {'shift'},  'h',      'left40' },
    { {'shift'},  'l',      'right60' },
    { {},         'i',      'upLeft' },
    { {},         'o',      'upRight' },
    { {},         ',',      'downLeft' },
    { {},         '.',      'downRight' },
    { {},         'n',      'nextScreen' },
    { {},         'right',  'moveOneScreenEast' },
    { {},         'left',   'moveOneScreenWest' },
  }
}
```

## Vimium

Vimium makes it possible and easy to navigate your browser and page contents using only the keyboard, I basically use the default settings for this plugin with some minor edits to mimic the behavior i have set up in Neovim.

```text
unmap J
map <c-j> previousTab

unmap K
map <c-k> nextTab

unmap H
map <c-h> goBack

unmap L
map <c-l> goForward
```

Using Vimium lets me open new tabs, search the web, and navigate effortlessly without a mouse, the plugin exists for all major browsers with some name variations but the idea is the same. I also add some custom css to get Nord theme in Vimium, given the option, be sure I'll be adding Nord theme!

## Homerow

Homerow is propriety paid software that makes int easier to incorporate universal keyboard centric navigation on macOS. It is free to use, you get an annoying popup every now and then prompting you to buy the product. Consider doing so if you like the product to support the developer.

Homerow enables clicking without a mouse in any app, much like Vimium but yeah anywhere. I've bound this feature to hyper+space and it works great, I'll have to admit that when I first got it, I used it all the time, since then usage has somewhat declined, still an amazing app though.

## Conclusion

Switching to a keyboard-first workflow isn’t just about efficiency—it’s about working smarter, not harder. With tools like Karabiner-Elements, Hammerspoon, Vimium, and Homerow, you can ditch the mouse as much as possible and turn your keyboard into a powerhouse of productivity. Whether it’s zipping around your OS, resizing windows like a boss, or flying through apps, this setup changes the game.

Sure, this isn’t for everyone. If you’re a video editor, designer, or FPS gamer, the mouse is probably your best friend. But for the rest of us in the tech world, who spend our days coding, writing, or tinkering, the keyboard is king. The tools I’ve shared here are macOS-focused, but you’ll find similar options on Linux and Windows, so no need to feel left out.

The bottom line? A keyboard-first workflow takes some effort to set up, but it’s 100% worth it. Once you’ve fine-tuned everything, it’s hard to imagine going back to point-and-click. The mouse may be necessary sometimes, but for the most part, it’s just in the way. So take the leap, experiment with the tools, and get your keyboard doing all the heavy lifting—your wrists (and your sanity) will thank you.
