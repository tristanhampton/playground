---
layout: blog
type: post
title: Building a Home Server
draft: true
date: 2024-04-25T18:39:53.375Z
summary: My experience building a home server using Proxmomx and a Dell Optiplex
  7050 SFF desktop, full of plenty of highs and lows.
---
I've gone through a number of iterations of home servers as I learn more about them. My first was just a Raspberry Pi with an external hard drive plugged in. Then I moved onto a cheap old laptop I had lying around. Eventually I saw [Retail Era](https://retail.era.ca/) sold mystery boxes and I thought that having my own fully fledged server at home would be *the coolest thing*. I set this one up with docker containers to host all my services. It was too large to keep in the living room, so I had to get a cheap [wifi extender](https://www.amazon.ca/TP-Link-AC750-WiFi-Range-Extender/dp/B07N1WW638/ref=sr_1_7?crid=22R1S62BHJPRQ&dib=eyJ2IjoiMSJ9.FmYnZZENPNoiAsi6FUVWVg-Dd69fqbfmv2MNh9CzjqBeo_Ug3bBaWOYJGuVdGn6sWigW99swKg-A10KxydiR5G0ysvm9gvWLTZgNEUKeaT5nNKCOjKrpezmhvUU9NXtT3JdjfMQ5L-RddO7T-k4GYFigTgfJvwOGMe0u0FNPrc3w0KCwy22MXnG2Dw80WMgndC8WlOs7NA01qYPpRGGjUlb-NM9MXMjNnmBCP5OtE3fSAJpMlQHEjuRvsI3j4YCSmzyxdBA3W0xqfvSHF0Hg5dPviu7DJn4_jfTS734VZRI.Aby-fXYGKgF1a2SAC3v0RTHQLmXccxmx_Xd1MefgV40&dib_tag=se&keywords=tp+link+wifi+extender&qid=1714070707&sprefix=tp+link+%2Caps%2C205&sr=8-7) from Amazon that I could plug it into while it sat in the storage room unmounted and objectively a little sad. 

Recently, the wifi extender started to fail, and would only run for an hour or so before losing connection. So once again, I decided to make another home sever.

I decided to document this here for two reasons:

1. If I need to revisit this, it's easier to remember what I did when I can read about it to jog my memory
2. I always find others written experiences of this sort of thing to be immensely helpful. Many guides assume things won't go wrong, and a personal experience documenting the roadblocks can go a long way for others.

## The Equipment

I wanted a computer small enough to fit in the living room so that I could plug it directly into my router without risk of losing internet. I found a [Dell Optiplex 7050 SFF](https://icecat.biz/en/p/dell/s027o7050sffusca/optiplex-pcs-workstations-7050-36992958.html) for a reasonable price on Retail Era, which arrived in a couple days. It also had an nVME M.2 SSD drive already installed, which meant that I could install the OS on that and dedicate the main 3.5" drive to storage, although it didn't come with one.

I was happy with how foolproof it was to take the machine apart. I've never built a PC before, so this was all new to me. The Optiplex has 4 SATA ports for drives, although it only has space for a 3.5" drive and the CD drive. I bought a [4TB drive from Best Buy](https://www.bestbuy.ca/en-ca/product/seagate-ironwolf-4tb-3-5-5400-rpm-sata-nas-internal-hard-drive-st4000vna06/17050915) to use for storage. This was my first time installing a drive on a PC, and it was super easy! I'll likely replace the CD drive with a [2.5" drive caddy](https://www.amazon.ca/SZYIKUER-9-5mm-Tray-DRIVES-12-7silver/dp/B075814NB2/ref=sr_1_5?crid=1XO4RJBWSE557&dib=eyJ2IjoiMSJ9.VKY67nuDm3NDvuPCdk7C_sHDzG_S4N_1E5XDLDl-mmMkcEwbTQ4PnU9dNsMPdsJC8wniL2AocpN9xxZX6qtbHxmHj5AQYPJL512faMWrw6D03zsyWKIw65-86Wj7x-CG_Ch57gC2yb1EnPL4Lt_-bAp0-Ov5AViLGJJI3EOMLCTU65JumlYv2Ig35KRyQFioZsiUo_f-coWgfrmisM3fA-QTCCZEj_vAgK8orS-nRsMrK0ovV0K8_Sm59dfzskzcleSPe4RwZA2ysb9Qe-WRTB2bT-NLDQ0zKFkW4nrGquI.A46UucKkG4KF9v4-bb9Y6VYTzioFsZVB5bBksevDevs&dib_tag=se&keywords=cd+drive+ssd+caddy&qid=1714071502&sprefix=cd+drive+ssd+caddy%2Caps%2C147&sr=8-5) since they're only $10, and I happen to have a 2.5" drive from an old family computer I could add.

## The OS

I've used a different setup for every different home server I've had. The last one had Ubuntu Server and I used Docker to pull images from Linux Server for all the services I wanted. I liked this, but ultimately decided to try a whole new OS: Proxmox. 

I liked the concept of being able to spin up VM's on the fly, so if I wanted to experiment with new things, I could do it without much hassle. When I was reading about it I thought it was a paid OS, but you can actually [download Proxmox for free](https://www.proxmox.com/en/downloads/proxmox-virtual-environment/iso) as long as you're not using it in production. So I downloaded version 8 and flashed it to an old USB I had laying around using [balenaEtcher](https://etcher.balena.io/). 

This is when I started running into my first roadblock. I booted from the USB drive and started the install, but it would repeatedly fail due to an `Input/Output error`. Googling this seemed to suggest that it was due to a faulty disk. 

Oh no. 

But I kept trying. And it kept failing. I flashed version 7 instead, and that also failed. I decided Proxmox wasn't worth it, so tried Ubuntu Server since it was tried and true for me. That also failed. I was nearly ready to throw in the towel, but decided to go back to trying Proxmox. Ubuntu Server worked on my far older machine with no problems, so it *should* have worked, which meant that something else was the problem. Maybe my USB was just old and failing, I had had it for a long time and it was the only one I had on hand. So I kept flashing the drive with Proxmox 7 over and over until it finally worked! I truly think it was a bad USB. I'll get a new one. Eventually. 

## The Software

Now I could access the Proxmox interface from my laptop! Success! Too bad I don't know the first thing about Proxmox or VM's. I thought that I wanted to have multiple VM's, each with the service that I had running on my old server on each one (Plex, Calibre, the various *arrs). I spun up a VM with Debian, but didn't have the first idea on how I would add my new 4TB disk to each VM so that I could share data between the VM's. I found a great [Proxmox playlist on YouTube by Novaspirit Tech](https://www.youtube.com/watch?v=9ruxTChA4Y4&list=PL846hFPMqg3gdL9lqzjt78kSdJenT-Q2d&pp=iAQB) that helped me immensely. He did a fantastic job of breaking down every step that I had to take. I'll try to summarize them here, but the videos are a great source of truth.

### LXC Containers

I used LXC containers instead of full VM's because they use less resources. Although my Optiplex was better than my last computer, it was still 7 years old, so this was a concern for me. I added a container by clicking "Create CT" and using a Debian iso image I had downloaded. In this container I installed sudo, git, docker, and made a new user account for myself. Then I followed the [instructions for installing samba](https://www.youtube.com/watch?v=AP61_ETd2GE&list=PL846hFPMqg3gdL9lqzjt78kSdJenT-Q2d&index=3&pp=iAQB) in this container.

I used scripts available from [Proxmox VE Helper-Scripts](https://tteck.github.io/Proxmox/) to make installing the other services I wanted a lot faster. I opened the console in the proxmox root, and pasted in the script to make my first container for Sonarr. It output an error saying that the script would only work on Proxmox 8+. And I installed 7 because I *could not* get 8 to install. So now I had two options:

1. Install all the containers and software by hand.
2. Update Proxmox to version 8.

Ultimately I decided to update Proxmox, and I'll have another section written below on this. For this section, it did work and I was able to install the following containers incredibly quickly using the default setups on each:

* Sonarr
* Radarr
* Readarr
* Prowlarr
* Overseerr
* Bazarr
* Homarr
* Transmission
* Plex
* OpenWRT

Each one took about 4GB of space on the nVME disk, and don't use a lot of RAM, of which I only have 8GB. As of writing this I'm definitely hitting that 8GB limit, so I might eventually look into adding more, since this machine has two empty slots.

### Updating Proxmox From 7 to 8

I was terrified to do this. I felt like I had been more than lucky to get version 7 working on this computer, and I didn't want to ruin it. At this point I had spent a couple of days playing around with the OS, watching YouTube videos, and generally getting familiar with the interface. Despite the time I'd spent doing this I hadn't actually accomplished much, so I decided to try reinstalling with version 8 from scratch. I flashed the USB drive (my poor overworked USB) and plugged it in. This time it wouldn't even boot into the Proxmox installer. The USB was unreadable. I guess it's worked hard for me, and it's time to let it go. This left me with the final option of updating Proxmox manually.

I found the [Proxmox Upgrade docs](https://pve.proxmox.com/wiki/Upgrade_from_7_to_8) which I found a little overwhelming at first, but I managed to muddle my way through it. There were a few files they recommended backing up, so I found them and copied them into a notes app so I could paste them back later if need be. I didn't need to, but that doesn't mean it wasn't worth doing. The most important part was changing the repo's that were available because by default it has the enterprise repo's for a paid subscription, which won't work since we're using this for free. The [instructions for changing the repo's](https://pve.proxmox.com/wiki/Package_Repositories) was on a separate page, but also fairly simple.

After that was done, I ran `apt update` and `apt dist-upgrade`. Voila! I was on version 8. I didn't even lose any of the containers that I had made!

### Sharing Data From One Disk

I was very confused by this part. I had found in the GUI that I could create a storage directory with my 4TB disk and add it to each container, but it would always need to dedicate its own space on the hard drive. So instead of one drive sharing 4TB between 10 containers, I had my drive split into 10 separate 400GB partitions, which was not what I was looking for.

In the YouTube series I linked above, Don walks you through doing this properly. You can't do it in the GUI, you have to use a command in the console. But this ended up being really easy. The command to run from the Proxmox node was

```bash
pct set [containerid] --mp1 /storage1,mp=/mnt/media
```

where `[containerid]` was the id, usually somewhere in the 100-110 range since I didn't have any other containers, and they're all conveniently listed in the GUI navigation. `--mp1` could be any mount point number, but since this was the first and only mount I was adding, 1 was fine for all of them. You just don't want conflicting mounts on the same container. `/storage1` was the name of the ZFS storage I had made with the 4TB disk (after I had wiped the partitions I mistakenly added earlier, and was able to set up in the GUI). Finally, `/mnt/media` was where the disk would be mounted in that container. So in each container I can access the same drive at `cd /mnt/media` which was exactly what I wanted. Now I could add media from one container and access it in the others. 

After this, I was able to open the Samba server on my Mac in finder and add folders for downloads, movies, and books for all my services to organize data.

### Networking Between Containers

This is the part that was most over my head, so I recommend just watching the video. I still don't really understand it. The same series video on setting up an [OpenWRT router](https://www.youtube.com/watch?v=3mPbrunpjpk&list=PL846hFPMqg3gdL9lqzjt78kSdJenT-Q2d&index=7&pp=iAQB) worked nearly perfectly for me. Afterwards I wasn't able to get anything to load until I followed the additional steps from a comment in the YouTube video, which I'll past here.

> A few things I had to do differently to get it working (also using PIA):
>
> 1. Don’t add the “dhcp option DNS” entries in the config file.
> 2. Under network>interfaces change tun0 to unmanaged and choose device: eth adapter tun0
> 3. Edit lan interface firewall settings to assign it to the lan zone

### Setting Up Services

I was finally at the point that I could set up all the services I wanted in my home server. After going through all the previous setup, things worked like a charm. Every service that needed access to the storage disk, I was able to find it in the file finder under `/mnt`. All the services that needed access to each other, I was able to add the IP address that the new OpenWRT service was handling and they would recognize each other. I won't go into details about setting these up, since all the services have their own documentation online. But they're fairly straightforward, it's the networking aspect that's tricky.

## Final Thoughts
This server ended up being rather inexpensive. I had actually meant to get an older Dell Optiplex off Facebook Marketplace for $70, but it sold minutes before I arrived to pick it up. My cost breakdown was:
1. Dell Optiplex 7050: $160
2. 4TB Internal Hard Drive: $120
3. Extra 16GB RAM (TBD): $30
4. 2.5" Caddy (TBD): $10

Making the grand total $280 ($320 TBD). I'm hopeful that I can sell my old server equipment along with it's two 2TB hard drives and recover some of that cost. That had cost me about $200 including the extra drives and the wifi extender, so if I can get hald of that back I'll be happy.

I had a lot of highs and lows setting this server up, but I'm happy with how it's turned out. I love being able to log into the Proxmox GUI and use the console of each container without having to memorize IP addresses so that I can SSH into them. Being able to start, stop, and update things from this same interface is also incredibly easy. It was an intimidating process to learn, but I'm happy that I did it, and I'm hopeful that this server will be the last I have to make, at least for a long while.