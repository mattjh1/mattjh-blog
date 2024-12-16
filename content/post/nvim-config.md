---
title: "init.lua - Exploring my Neovim Config"
date: "2024-12-16"
description: ""
tags:
  - neovim
  - editor
categories:
  - productivity
  - vim
  - neovim
---

I've made several post about Vim already, but i can't seem to help myself, I love my editor! Anyway, this post will be about going through some highlights of my custom configuration.

<!--more-->

First off, I did not fully start from scratch with this configuration. I found a pretty basic neovim configuration on github that had the core elements I was looking for already set up. Id love to give reference to this repo but I cant seem to find it anymore. But the gist of it involves having a a clean structure, a Language Server Protocol (LSP) setup, snippets and completions.

However, since this inception I have continued to adapt it to my specific needs and it is evolving, all though I have it in a pretty stable state at the moment and have not messed around with it too much lately except for the occasional update maintenance. Lets start off by discussing how my setup is organized to keep things easy to maintain.

You can find my setup in its entirety over at [GitHub](https://github.com/mattjh1/dotfiles/tree/main/dotfiles/dot_config/nvim).

## Structure

I keep the `init-old.vim` as a reminder of how far my configuration has come.

```plaintext
.
├── init-old.vim
├── init.lua
├── lazy-lock.json
└── lua
    ├── autocmds.lua
    ├── keybinds.lua
    ├── options.lua
    └── plugins
        ├── auto-session.lua
        ├── blankline.lua
        ├── bufferline.lua
        ├── cmp.lua
        ├── debuggers.lua
        ├── gitsigns.lua
        ├── harpoon.lua
        ├── hf-llm.lua
        ├── init.lua
        ├── lazygit.lua
        ├── lspconfig.lua
        ├── lualine.lua
        ├── luasnip.lua
        ├── mason.lua
        ├── mason_lspconfig.lua
        ├── none-ls.lua
        ├── nord.lua
        ├── nvim-tree.lua
        ├── obsidian.lua
        ├── possession.lua
        ├── ranger.lua
        ├── startify.lua
        ├── telescope.lua
        └── treesitter.lua
```

Its quite simple really and self explanatory, the root `init.lua` simply requires all needed files:

```lua
require "options"
require "keybinds"
require "autocmds"
require "plugins"
```

Out of these the "plugins" section is by far the most extensive, the `lua/plugins/init.lua` initialize all my plugins with [Lazy plugin manager](https://github.com/folke/lazy.nvim) and the other files contain specific plugin configurations. There is quite a bit to dig through, lets go!

## Keybinds

Lets start off with keybinds, this section is where I try to keep all my custom binds collected in one place. Most of these (not all) are tied to plugins as I try my best to keep the default binds intact so I'm still capable to manoeuvring a barebones vi setup when that need arise.

Most setups I've seen use `<space>` as the leader key, i use `","`. There is actually plenty of drawbacks to using comma as the leader key. And I've seriously considered going for `<space>` instead, they reason i have not is because my current ways are so ingrained at this point and it is working fine for me, maybe at some point I'll go ahead and make the change, but that day is not today.

Here are some noteworthy binds that are not directly tied to any plugins, we'll cover plugin specifics in the plugin section.

**Better Indenting:**

```lua
vim.keymap.set("v", "<", "<gv")
vim.keymap.set("v", ">", ">gv")
```

**Description**: Improves the default behavior of indentation in Visual mode. After shifting text left (`<`) or right (`>`), this mapping reselects the indented text, so you can continue adjusting indentation without needing to reselect it manually.

**Rebinding `Y` to Yank to End of Line:**

```lua
vim.keymap.set("", "Y", "y$", opts)
```

**Description**: Makes `Y` yank (copy) from the cursor to the end of the line instead of the entire line, aligning its behavior with `D` (delete to end of line) and `C` (change to end of line).

**Delete Without Affecting Clipboard:**

```lua
vim.keymap.set({ "n", "v" }, "<leader>d", [["_d]])
```

**Description**: Maps `<leader>d` to delete text without overwriting the clipboard. Perfect for deleting without losing your current clipboard content.

**Move Lines Up and Down:**

```lua
vim.keymap.set("v", "K", ":m '<-2<CR>gv=gv", opts)
vim.keymap.set("v", "J", ":m '>+1<CR>gv=gv", opts)
```

**Description**: Makes it easier to move selected lines up (`K`) or down (`J`) in Visual mode. After moving the lines, the selection remains active, allowing you to continue editing or moving without needing to reselect. The `gv=gv` part reindents the moved lines, ensuring proper alignment with the surrounding code.

**Change Pane Vertically:**

```lua
vim.keymap.set("n", "<C-h>", "<C-w>h", opts)
vim.keymap.set("n", "<C-l>", "<C-w>l", opts)
```

**Description**: Quickly navigate between panes (or splits) horizontally. `<C-h>` moves to the left pane, and `<C-l>` moves to the right pane, allowing you to switch focus between side-by-side splits, i never use horizontal splits. I use `<C-j>` and `<C-k>` with `bufferline` plugin to navigate buffers.

**New Line Up/Down Without Entering Insert Mode:**

```lua
vim.keymap.set("n", "OO", "O<Esc>k", opts)
vim.keymap.set("n", "oo", "O<Esc>j", opts)
```

**Description**: Quickly add a new line above or below the current one without entering insert mode. `OO` creates a new line above and moves the cursor up, while `oo` creates a new line below and moves the cursor down.

**Center on Movements:**

```lua
vim.keymap.set("n", "<C-d>", "<C-d>zz", opts)
vim.keymap.set("n", "<C-u>", "<C-u>zz", opts)
vim.keymap.set("n", "n", "nzzzv", opts)
vim.keymap.set("n", "N", "Nzzzv", opts)
vim.keymap.set("n", "j", "gj", opts)
vim.keymap.set("n", "k", "gk", opts)
```

**Description**: These mappings ensure the screen stays centered when scrolling or searching. `<C-d>` and `<C-u>` now scroll half a page while keeping the cursor centered. The `n` and `N` keymaps center the screen when navigating search results. The `j` and `k` keys are adjusted to handle wrapped lines gracefully, keeping the cursor in the right position.

## Options

This is where I set options, well duh. But yeah, thats it. Many of these I've carried with me for as long as I've used Vim while others I've picked up along the way.
Some noteworthy ones are:

**Clipboard Integration**

```lua
vim.opt.clipboard = "unnamed"
```

**Description**: This option links Vim’s clipboard to the system clipboard, making it possible to copy/paste between Vim and other applications. By setting `"unnamed"`, you enable Vim to use the clipboard like the default register, so you can easily share text across the system.

**Relative Line Numbers**

```lua
vim.opt.relativenumber = true
```

**Description**: This changes line numbering to show the line number relative to the current cursor position. This makes it easy to see how far your target lines are, making navigation commands like `5j` (move down 5 lines) more intuitive.

**Smart Indentation**

```lua
vim.opt.smartindent = true
```

**Description**: This automatically adjusts indentation based on the code structure, especially helpful when writing languages like Python, JavaScript, or C. It simplifies the indentation process and helps maintain a clean code style.

**Undo and Persistent History**

```lua
vim.opt.undofile = true
vim.opt.undodir = os.getenv("HOME") .. "/.vim/undodir"
```

**Description**: These options enable persistent undo history. The undo history is saved between sessions in the specified directory, so you can undo changes even after closing and reopening Vim.

**Search and Highlighting**

```lua
vim.opt.hlsearch = false
vim.opt.incsearch = true
```

**Description**:

- `hlsearch = false` disables highlighting search results after you’ve moved past them, making it less distracting.
- `incsearch = true` enables incremental search, showing matches as you type, which speeds up finding the right spot.

**Tab Settings**

```lua
vim.opt.tabstop = 2
vim.opt.shiftwidth = 2
vim.bo.softtabstop = 2
```

**Description**: These options define your indentation style. With `tabstop`, `shiftwidth`, and `softtabstop` all set to 2, you're ensuring that tabs are visually represented as 2 spaces, and auto-indentation aligns with this choice. This keeps your code clean and consistent.

**Color and Visual Tweaks**

```lua
vim.opt.termguicolors = true
```

**Description**: Enables true color support in your terminal, allowing for a richer, more vibrant color experience in Vim. This is especially useful when working with modern color scheme like nord.

**Other Options**

```lua
vim.opt.timeoutlen = 400
vim.opt.scrolloff = 999
vim.opt.signcolumn = "yes"
```

**Description**:

- `timeoutlen = 400` adjusts the time Vim waits before considering a key sequence finished, helping prevent accidental commands.
- `scrolloff = 999` keeps the cursor at least 999 lines away from the edge of the screen, ensuring your view is always centered.
- `signcolumn = "yes"` makes the sign column always visible, useful for debugging or displaying git status icons.

## Autocommands

Autocommands are a way to tell Vim to run certain commands whenever certain events happen. Lets have a look at a few cases where i do just this.

**Toggle Relative Line Numbers in Insert Mode**

```lua
autocmd("InsertEnter", {
  callback = function()
    vim.opt.relativenumber = false
  end,
})

autocmd("InsertLeave", {
  callback = function()
    vim.opt.relativenumber = true
  end,
})
```

**Description**: These commands adjust the line numbering behavior based on whether you're in Insert mode or Normal mode:

- When entering Insert mode (`InsertEnter`), relative line numbers are turned off to make it easier to navigate with absolute line numbers.
- When leaving Insert mode (`InsertLeave`), it reverts to relative line numbers, which are more useful for normal navigation.

**Highlight Text After Yank**

```lua
autocmd("TextYankPost", {
  callback = function()
    vim.highlight.on_yank({ higroup = "Visual", timeout = 100 })
  end,
})
```

**Description**: This `autocmd` highlights text that was just yanked (copied) in Visual mode. It uses the `Visual` highlight group and times out the highlight after 100 milliseconds. This gives you a visual feedback when you copy text, making it easier to confirm the yank action.

**Enable Spellchecking for Specific File Types**

```lua
autocmd("FileType", {
  pattern = { "gitcommit", "markdown", "text", "tex" },
  callback = function()
    vim.opt_local.spell = true
  end,
})
```

**Description**: This `autocmd` automatically enables spellchecking for certain file types, like `gitcommit`, `markdown`, `text`, and `tex`. It uses `vim.opt_local.spell = true` to enable the spellcheck feature on a per-buffer basis, ensuring your commits, markdown files, and text documents are checked for spelling errors while editing.

**Bonus: Go Template Detection in HTML Files**

```lua
  pattern = "*.html",
autocmd({ "BufRead", "BufNewFile", "BufReadPost", "BufWinEnter" }, {
	pattern = "*.html",
	group = filetypedetect_group,
	callback = function()
		if vim.fn.expand("%:e") == "html" then
			if vim.fn.search("{{", "nw") ~= 0 then
				vim.bo.filetype = "gohtmltmpl"
			end
		end
	end,
})

autocmd("VimEnter", {
	group = filetypedetect_group,
	callback = function()
		for _, buf in ipairs(vim.api.nvim_list_bufs()) do
			if vim.bo[buf].buftype == "" and vim.api.nvim_buf_is_loaded(buf) then
				local filename = vim.api.nvim_buf_get_name(buf)
				if filename:match("%.html$") and vim.fn.search("{{", "nw", buf) ~= 0 then
					vim.bo[buf].filetype = "gohtmltmpl"
				end
			end
		end
	end,
})
```

**Description**: These `autocmds` detects whether a file with `.html` extension contains Go templating (used in Hugo sites, for example). If it finds Go template markers like `{{` in the file, it switches the filetype to `gohtmltmpl`, in my hugo projects I use a [prettier plugin](https://github.com/NiklasPor/prettier-plugin-go-template) to handle this filetype. So I guess its fair to say, this solution is a pretty niche case.

## Plugins

If I we're to go in depth about every single plugin that I use, then this would be a very long post. Instead lets focus on a select few and discuss why they're detriment to my setup and the problems they solve.

### `init.lua`

This is where I install Lazy and initialize all my plugins.

```lua

local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not vim.loop.fs_stat(lazypath) then
	vim.fn.system({
		"git",
		"clone",
		"--filter=blob:none",
		"https://github.com/folke/lazy.nvim.git",
		"--branch=stable",
		lazypath,
	})
end
vim.opt.rtp:prepend(lazypath)

return require("lazy").setup({
	performance = {
		rtp = {
			reset = false,
			disabled_plugins = {
				"gzip",
				"matchit",
				"matchparen",
				"netrwPlugin",
				"tarPlugin",
				"tohtml",
				"tutor",
				"zipPlugin",
			},
		},
	},
	defaults = { lazy = false },
	"rafamadriz/friendly-snippets",
	"saadparwaiz1/cmp_luasnip",
    -- A whole lot more plugins follows here...
})

```

Any missing plugins will be automatically installed on startup by `lazy.nvim`, we can also call it manually with the command `:Lazy`.

### Telescope

Simply put, `Telescope` is a fuzzy finder, and for the longest time, I didn’t quite understand why so many people favored it over `FZF` in Neovim. Now, I get it.

`FZF` is a fantastic fuzzy finder, and I use it extensively in my shell environment. It integrates nicely into a Vim/Neovim setup. However, **Telescope** is designed specifically with **Neovim** in mind. It leverages the built-in Lua API and integrates seamlessly with other Neovim plugins and its configuration system.

Here’s why **Telescope** is preferred over **FZF** in Neovim:

- **Telescope** is highly extensible via Lua, allowing you to create custom pickers, integrate with various sources, and extend functionality easily.
- It comes with built-in extensions for LSP symbols, file searches, Git files, and more—requiring minimal configuration.
- While **FZF** is also extensible, its setup focuses more on shell configuration and doesn’t tap into Neovim's Lua API as natively.
- **Telescope** integrates out of the box with Neovim’s built-in LSP, making it easy to search for definitions, references, and symbols directly.
- It also works well with **Treesitter** to provide smarter fuzzy finding within structured code.
- On the other hand, **FZF** does not have as deep or native integration with Neovim’s LSP or Treesitter. To achieve similar functionality, you'd need external plugins or manual configuration.

**Telescope Keymaps**

These are the keymaps I use to interact with **Telescope**. They help me quickly access various file-related and LSP functionalities:

- `<leader>b`: Opens the **Telescope file browser** for navigating files in the current directory and selecting buffers.
- `<leader>f`: Initiates a **live grep search** across your project using **ripgrep**, enabling fast and efficient searching.
- `<leader>p`: Opens the **file finder** to quickly search for files in your project.
- `<leader>bb`: Displays a list of open **buffers**, making it easy to switch between them.
- `dr`: Triggers **LSP references** search, showing all references to the symbol under the cursor.

These keymaps are designed to streamline workflow by integrating Telescope's powerful searching capabilities into my daily usage.

### none-ls

I use **none-ls** (a fork of `null-ls`) to manage external formatters and linters in my Neovim setup. It bridges the gap between tools like Prettier, Black, and ESLint, and Neovim’s LSP client. Setting this up was one of the moments where I realized how seamlessly Neovim can handle my formatting and linting needs.

Here’s how I’ve set it up:

- **Formatters:**  
  I use formatters like `stylua`, `black`, and `prettier` (configured for Hugo's Go HTML templates). Each formatter is tied to its respective file type, so I don’t need to think about it—just hit save and let the formatting happen.

- **Linters and Actions:**  
  I rely on `eslint_d` for both diagnostics and code actions. It’s fast because it runs as a daemon, meaning it doesn’t spin up a new process every time I save.

- **Automatic Formatting:**  
  When a file is saved, the LSP client calls `vim.lsp.buf.format` to handle formatting for supported languages. I’ve ensured this runs only when the client supports the `textDocument/formatting` capability.

This setup makes my workflow smoother. I hit save, and my code is clean and linted—no extra commands or external tools required.

### Obsidian.nvim

If you're managing a personal knowledge base or taking notes directly in Neovim, **Obsidian.nvim** is a fantastic plugin for integrating with an Obsidian vault. Here's how I use it:

**Key Mappings**  
These mappings help me quickly navigate and interact with my notes:

```lua
-- Open the Obsidian file switcher
vim.keymap.set("n", "<leader>op", ":ObsidianQuickSwitch<CR>", opts)

-- Search through all notes in the vault
vim.keymap.set("n", "<leader>of", ":ObsidianSearch<CR>", opts)

-- Jump directly to today's daily note
vim.keymap.set("n", "<leader>ot", ":ObsidianToday<CR>", opts)
```

**Why I Use It**

1. **Daily Notes:** The `<leader>ot` mapping helps me jump straight into my daily note. I use templates for these notes, so it automatically includes headings and sections for tasks, logs, or ideas.
2. **Quick Switching:** `<leader>op` is indispensable for jumping between notes without breaking flow.
3. **Search Integration:** `<leader>of` allows me to quickly find notes using fuzzy searching, which works seamlessly with the Obsidian vault structure.

### Treesitter

Treesitter is one of those plugins that makes you wonder how you ever lived without it. It enhances syntax highlighting and parsing, making the editor feel _smarter_.

Here’s how I’ve configured it:

- **Languages:**  
  I’ve ensured support for a wide range of languages I work with regularly, from Lua and Python to markdown and JSON.

- **Highlighting:**  
  The syntax highlighting is on another level. Treesitter uses actual parsing to understand your code rather than relying on regex patterns. This means better accuracy and less breakage, especially in complex files.

- **`use_languagetree`:**  
  This option makes Treesitter even more powerful by leveraging Neovim’s built-in language tree API for highlighting and editing structured code.

If you’re serious about working in Neovim, investing in Treesitter is one of the best things you can do for yourself. It makes writing and navigating code faster, more accurate, and far less painful.

### Harpoon

**Harpoon** is a game-changer for file navigation and buffer management. It allows me to mark files I'm currently working on and jump between them with minimal effort. Here's a breakdown of how I leverage Harpoon in my workflow:

**Key Mappings**  
These bindings make managing and switching between files incredibly efficient:

```lua
-- Add the current file to Harpoon's list
vim.keymap.set("n", "<leader>a", function()
	require("harpoon"):list():add()
end)

-- Quickly jump to specific files in the Harpoon list
vim.keymap.set("n", "<leader>1", function()
	require("harpoon"):list():select(1)
end)
vim.keymap.set("n", "<leader>2", function()
	require("harpoon"):list():select(2)
end)
vim.keymap.set("n", "<leader>3", function()
	require("harpoon"):list():select(3)
end)
vim.keymap.set("n", "<leader>4", function()
	require("harpoon"):list():select(4)
end)
vim.keymap.set("n", "<leader>5", function()
	require("harpoon"):list():select(5)
end)

-- Navigate to the previous or next Harpoon buffer
vim.keymap.set("n", "<C-P>", function()
	require("harpoon"):list():prev()
end)
vim.keymap.set("n", "<C-N>", function()
	require("harpoon"):list():next()
end)
```

**Why I Use It**

1. **Effortless File Management:** Adding a file to the list with `<leader>a` means I can jump back to it anytime without searching or reopening.
2. **Custom Workflows:** I tend to reserve `<leader>1` to `<leader>5` for the files I’m actively editing. These bindings allow me to switch instantly without disrupting my focus.
3. **Buffer Navigation:** `<C-P>` and `<C-N>` make navigating across Harpoon-marked files feel like tabbing through open browser tabs—smooth and intuitive.

## Closing Words

Configuring Neovim has been a rewarding journey, one that constantly evolves as my needs and understanding of the editor grow. It started with finding a simple setup to get the basics right, but over time, it’s become a personalized tool that feels like an extension of how I think and work.

The joy of tweaking a setup, adding functionality, and refining workflows lies within gaining increased knowledge in the tools I use daily. Yet, the beauty is that it doesn’t demand perfection—it’s okay for your config to be a work in progress.

I hope this glimpse into my setup inspires you to experiment with your own. Whether you’re starting from scratch or adapting someone else’s configuration, the key is to make it work for you. At the end of the day, your editor should empower you, not slow you down.

If you’ve got questions, suggestions, or just want to share your own setup, feel free to drop a comment. I’d love to learn from your experiences too. Happy configuring! 🚀
