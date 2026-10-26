
"use strict";
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
/* Audited actual sources 2026-10-26. Broken/unconfirmed PDF links and catalog-only entries removed.
SlideShare decks are independently uploaded, not government publications. */
const RESOURCES=[
  {
    "id": "tesda-regs",
    "kind": "pdf",
    "agency": "TESDA",
    "title": "CSS NC II — Training Regulations",
    "description": "Actual TESDA training regulation document for computer hardware assembly, OHS and maintenance.",
    "detail": "Official TESDA PDF · 2013 edition",
    "url": "https://tesda.gov.ph/Downloadables/TRs/TR%20Computer%20Systems%20Servicing%20NC%20II%20.pdf",
    "lessons": [
      0,
      2,
      3,
      4,
      5
    ],
    "level": "official",
    "access": "Real PDF file opens at its original publisher URL.",
    "featured": false
  },
  {
    "id": "tesda-sag",
    "kind": "pdf",
    "agency": "TESDA",
    "title": "CSS NC II — Self-Assessment Guide",
    "description": "Actual seven-page TESDA self-assessment guide with hardware installation and checking competencies.",
    "detail": "Official TESDA PDF · 7 pages",
    "url": "https://www.tesda.gov.ph/Downloadables/SAG%20-%20Computer%20Systems%20Servicing%20NC%20II.pdf",
    "lessons": [
      0,
      3,
      4,
      5
    ],
    "level": "official",
    "access": "Real PDF file opens at its original publisher URL.",
    "featured": false
  },
  {
    "id": "las39",
    "kind": "pdf",
    "agency": "DepEd",
    "title": "LAS39 — Proper Cable Connections During Assembly",
    "description": "One-page DepEd activity sheet on motherboard power, CPU power, storage and front-panel cables.",
    "detail": "Official DepEd activity sheet · 1 page",
    "url": "https://www.deped.gov.ph/wp-content/uploads/Q1-TLE9-ICT-LAS39-Computer-System-Servicing.pdf",
    "lessons": [
      1,
      4,
      5
    ],
    "level": "official",
    "access": "Real PDF file opens at its original publisher URL.",
    "featured": false
  },
  {
    "id": "crucial-ram",
    "kind": "pdf",
    "agency": "Crucial / Micron",
    "title": "Memory Module Installation — Illustrated Guide",
    "description": "Genuine manufacturer PDF with installation illustrations, ESD and troubleshooting guidance.",
    "detail": "Manufacturer installation PDF · 4 pages",
    "url": "https://www.crucial.com/content/dam/crucial/dram-products/dram-family/documents/installation-guides/crucial-dram-install-guide-en.pdf",
    "lessons": [
      1,
      3,
      4,
      5
    ],
    "level": "manufacturer",
    "access": "Real PDF file opens at its original publisher URL.",
    "featured": false
  },
  {
    "id": "assembly-slides",
    "kind": "slides",
    "agency": "SlideShare · ErwinIruma",
    "title": "PC Assembly and Disassembly.pptx",
    "description": "Your 41-slide reference showing removal, installation, motherboard preparation and cable connections.",
    "detail": "Third-party presentation · 41 slides",
    "url": "https://www.slideshare.net/slideshow/pc-assembly-and-disassemblypptx/256188561",
    "lessons": [
      1,
      3,
      4
    ],
    "level": "thirdparty",
    "access": "Slides viewable online; downloading may require an account. Independently uploaded, not official curriculum.",
    "featured": true
  },
  {
    "id": "lesson12-slides",
    "kind": "slides",
    "agency": "SlideShare · jkingmonderin",
    "title": "Personal Computer Assembly and Disassembly — Lesson 1 & 2",
    "description": "Viewable 12-slide illustrated presentation introducing required tools, safety, components and troubleshooting.",
    "detail": "Third-party classroom slides · 12 slides",
    "url": "https://www.slideshare.net/slideshow/lesson-1-2-personal-computer-assembly-and-disassembly-pptx/274917121",
    "lessons": [
      0,
      1,
      3,
      4
    ],
    "level": "thirdparty",
    "access": "Slides viewable online; downloading may require an account. Independently uploaded, not official curriculum.",
    "featured": false
  },
  {
    "id": "css-coc-slides",
    "kind": "slides",
    "agency": "SlideShare · ReminPasion1",
    "title": "CSS NC II — LO1/COC1: Assemble Computer Hardware",
    "description": "Viewable 28-slide classroom presentation explaining installation, OHS and computer hardware.",
    "detail": "Third-party presentation · 28 slides",
    "url": "https://www.slideshare.net/slideshow/computer-systems-servicing-nc-ii-lo1-coc1-2024-pptx/271067268",
    "lessons": [
      0,
      1,
      3,
      4
    ],
    "level": "thirdparty",
    "access": "Slides viewable online; downloading may require an account. Independently uploaded, not official curriculum.",
    "featured": false
  },
  {
    "id": "ohs-slides",
    "kind": "slides",
    "agency": "SlideShare · dexdexjoyjoy",
    "title": "Computer Systems Servicing 10 — OHS",
    "description": "Viewable 49-slide classroom presentation on safety hazards and workplace procedures.",
    "detail": "Third-party presentation · 49 slides · 2017",
    "url": "https://www.slideshare.net/slideshow/computer-systems-servicing-10-ohs-pptx/270741769",
    "lessons": [
      0,
      3
    ],
    "level": "thirdparty",
    "access": "Slides viewable online; downloading may require an account. Independently uploaded, not official curriculum.",
    "featured": false
  },
  {
    "id": "msi-build",
    "kind": "guide",
    "agency": "MSI",
    "title": "Build a PC — Illustrated 10-Step Guide",
    "description": "Manufacturer's actual step-by-step page: CPU, RAM, M.2, cooler, motherboard, GPU, PSU, cables and OS.",
    "detail": "Manufacturer illustrated learning guide",
    "url": "https://www.msi.com/Landing/how-to-build-a-pc",
    "lessons": [
      0,
      1,
      2,
      3,
      4,
      5
    ],
    "level": "manufacturer",
    "access": "Full tutorial available on the manufacturer's website.",
    "featured": false
  },
  {
    "id": "asus-cpu",
    "kind": "guide",
    "agency": "ASUS",
    "title": "How to Install a CPU on a Motherboard",
    "description": "Manufacturer illustrations for AMD and Intel processor installation and orientation.",
    "detail": "Official ASUS guide · updated March 2026",
    "url": "https://www.asus.com/us/support/faq/1047659/",
    "lessons": [
      1,
      2,
      4
    ],
    "level": "manufacturer",
    "access": "Full tutorial available on the manufacturer's website.",
    "featured": false
  },
  {
    "id": "asus-gpu",
    "kind": "guide",
    "agency": "ASUS",
    "title": "How to Install a Graphics Card",
    "description": "Actual GPU mounting, PSU cable connection and no-display troubleshooting instructions.",
    "detail": "Official ASUS guide · updated May 2026",
    "url": "https://www.asus.com/us/support/faq/1047391/",
    "lessons": [
      1,
      2,
      4,
      5
    ],
    "level": "manufacturer",
    "access": "Full tutorial available on the manufacturer's website.",
    "featured": false
  },
  {
    "id": "amd-am4",
    "kind": "guide",
    "agency": "AMD",
    "title": "AMD AM4 — Motherboard Compatibility",
    "description": "Manufacturer's real AM4 chipset and Ryzen 5000 compatibility matrix.",
    "detail": "AMD platform comparison · AM4 / DDR4",
    "url": "https://www.amd.com/en/products/processors/chipsets/am4.html",
    "lessons": [
      1,
      2
    ],
    "level": "manufacturer",
    "access": "Full tutorial available on the manufacturer's website.",
    "featured": false
  },
  {
    "id": "amd-am5",
    "kind": "guide",
    "agency": "AMD",
    "title": "AMD AM5 — Motherboard Platform",
    "description": "Manufacturer's actual AM5 platform and chipset information for DDR5 systems.",
    "detail": "AMD platform reference · AM5",
    "url": "https://www.amd.com/en/products/processors/chipsets/am5.html",
    "lessons": [
      2
    ],
    "level": "manufacturer",
    "access": "Full tutorial available on the manufacturer's website.",
    "featured": false
  },
  {
    "id": "amd-cpu",
    "kind": "guide",
    "agency": "AMD",
    "title": "Processor Handling Guidance",
    "description": "Safe CPU handling, pin protection and hardware installation precautions from AMD.",
    "detail": "Official processor safety guidance",
    "url": "https://www.amd.com/en/resources/support-articles/faqs/CPU-100.html",
    "lessons": [
      0,
      3,
      4
    ],
    "level": "manufacturer",
    "access": "Full tutorial available on the manufacturer's website.",
    "featured": false
  },
  {
    "id": "amd-bios",
    "kind": "guide",
    "agency": "AMD",
    "title": "Ryzen BIOS Update and Compatibility Guide",
    "description": "Manufacturer guidance explaining why a processor may not boot until BIOS support is updated.",
    "detail": "Official AMD troubleshooting guide",
    "url": "https://www.amd.com/en/resources/support-articles/faqs/cpu-99.html",
    "lessons": [
      2,
      5
    ],
    "level": "manufacturer",
    "access": "Full tutorial available on the manufacturer's website.",
    "featured": false
  }
];
const RESOURCE_FILTERS=[["all","All available materials"],["slides","Presentations"],["pdf","PDF documents"],["guide","Practical guides"]];
let resourceFilter="all";
const MODULES=[
{title:"Occupational Health & Safety",unit:"01 / SAFE PREPARATION",time:"30–40 min",target:"Apply workplace safety procedures and electrostatic-discharge controls before touching components.",outcomes:["Identify electrical, sharp-edge, dust and ESD hazards.","Distinguish personal protective equipment from ESD-control equipment.","Perform safe power-down and workspace preparation."],content:[["What is OHS?","Occupational Health and Safety (OHS) means controlling risks before work begins. For PC servicing, the most important controls include shutdown and isolation from mains power, removing unnecessary liquids and clutter, and checking for exposed electrical or mechanical hazards."],["Electrostatic discharge","Static charge from a person can damage sensitive electronic components. Where appropriate, use an approved ESD wrist strap and antistatic mat connected to a suitable designated grounding point. Follow the manufacturer's and school's ESD procedures; do not improvise connections to live equipment."],["Before opening a case","Shut down the operating system; switch off and unplug the mains power; disconnect peripherals; allow components to cool; confirm the computer is not powered; maintain a clean, dry, stable workspace. Never open the internal housing of a PSU."]],activity:"Scenario: You are asked to replace RAM. The PC is running and a drink sits beside the keyboard. Write the first four actions you would take before touching the memory modules.",check:"Explain why safety glasses and an ESD wrist strap solve different problems.",resource:"tesda-sag",codes:"TESDA CSS NC II — workplace health, safety and assembly preparation"},
{title:"Inside the System Unit",unit:"02 / PART IDENTIFICATION",time:"40–50 min",target:"Name system-unit components and connect each to its function and interfaces.",outcomes:["Identify a CPU, motherboard, RAM, GPU, power supply, storage, cooling and chassis.","Describe each component's main role in processing, power, storage or thermal control.","Locate common sockets, slots, ports and cable connections."],content:[["The motherboard","The motherboard links the CPU, memory, expansion slots, storage and external ports. It defines CPU socket compatibility, memory generation, expansion options and many practical installation limits."],["Processor and memory","The CPU executes instructions; RAM temporarily holds actively used data. CPU socket, board firmware support and memory-generation compatibility must all be checked. A CPU without integrated graphics generally requires a graphics card for display output."],["Storage, expansion and power","NVMe SSDs commonly connect through M.2 slots; SATA drives require data and power connections. A dedicated graphics card uses a PCIe x16 slot and may need auxiliary PCIe power. The PSU provides regulated system power and should be selected for appropriate capacity, connectors and quality."],["Cooling and the case","CPU coolers require matching mounting hardware and physical clearance. Fans move air through the enclosure; case size determines motherboard format and GPU/cooler clearance."]],activity:"Use the interactive PC builder and point to the role of each selected component. Draw a simple functional diagram: power → motherboard/CPU → processing, with RAM, storage and graphics linked correctly.",check:"Differentiate the function of RAM from storage, and the role of the CPU from the GPU.",resource:"msi-build",codes:"TESDA CSS NC II — installation and configuration of computer systems"},
{title:"Compatibility and Smart PC Builds",unit:"03 / HARDWARE SELECTION",time:"35–45 min",target:"Select compatible components for a specified budget and justify the choice.",outcomes:["Match CPU socket to motherboard socket.","Match DDR4 or DDR5 memory to the motherboard's supported type.","Check power headroom, GPU length and case form-factor support."],content:[["Socket and firmware","A Ryzen 5 5600 uses AM4, whereas a Ryzen 5 7600 uses AM5. These processors cannot be swapped into each other's motherboards. Even a matching socket may require an appropriate BIOS version."],["Memory and storage","DDR4 and DDR5 DIMMs are not interchangeable. An NVMe M.2 SSD requires an appropriate M.2 socket and protocol support. Check the number of usable slots, not merely the product name."],["Fit and power","A GPU must fit the case's available length and slots. CPU coolers must support the socket and fit the chassis. Estimated peak system demand and the correct GPU cables inform PSU selection; wattage alone never guarantees quality."],["Budgets and prices","Prices differ by store, variant, date and stock. Use listed source pages and the builder as a dated classroom estimation exercise—not a purchase recommendation or real-time quotation."]],activity:"Create one AM4 and one AM5 build. Deliberately pair an AM4 processor with an AM5 board, then explain each compatibility warning.",check:"Why can a DDR5 RAM kit not be installed on a DDR4-only motherboard?",resource:"amd-am4",codes:"CSS components selection; installing and configuring computer systems"},
{title:"Tools, PPE and Bench Preparation",unit:"04 / HAND TOOLS",time:"30–40 min",target:"Choose the appropriate tools and safety controls for system-unit servicing.",outcomes:["Select a correctly sized screwdriver, ESD controls, lighting and organizers.","Use tools only for their intended servicing operations.","Explain where PPE, ventilation and equipment isolation are necessary."],content:[["Hand tools","A correctly fitting Phillips screwdriver reduces the likelihood of stripped screw heads. Use tweezers or needle-nose pliers only as appropriate and avoid force near delicate sockets. Keep screws in labeled trays."],["Diagnostic tools","A flashlight helps inspect hard-to-see connectors. A suitable digital multimeter may be used by trained personnel on appropriate accessible circuits under the teacher's procedure. A PSU tester is not permission to open the PSU."],["Cleaning supplies","Use a lint-free cloth, appropriate electronics-safe cleaning materials and approved compressed air procedures. Never spray liquid directly into energized equipment. Follow ventilation guidance for aerosols."],["Personal protection vs ESD","Safety glasses protect eyes from dust and debris; closed-toe footwear reduces contact hazards. An ESD strap is an equipment-protection control, not a substitute for isolating power or for electrical protective equipment."]],activity:"Build a servicing kit for opening a case, reseating RAM and removing dust. Label each item with its specific intended use and handling precaution.",check:"Give two examples of tasks where a screwdriver is appropriate and one where it should never be used.",resource:"msi-build",codes:"TESDA CSS NC II — use hand tools and occupational safety"},
{title:"Safe Assembly & Disassembly",unit:"05 / PRACTICAL SEQUENCE",time:"60–90 min",target:"Practice a structured installation and removal sequence, with careful checks and teacher supervision.",outcomes:["Prepare a chassis and confirm motherboard standoff placement.","Identify safe component-installation dependencies.","Carry out a systematic inspection before reconnecting power."],content:[["Plan before installation","Check the parts list and manufacturer manuals. Prepare a stable ESD-controlled workspace; make sure the PC is unplugged. Check standoff positions and avoid extra standoffs that can short a motherboard."],["Assemble the core","Following model-specific guidance, seat the compatible CPU without force; install supported RAM in the recommended slots; attach appropriate cooling with correctly applied thermal interface material; mount the board onto the correct standoffs; install storage and PSU; route and connect power and data cables; install GPU and cooling fans as applicable."],["Verify before power-on","Check CPU cooler retention, CPU fan cable, 24-pin ATX power, CPU EPS power, storage connections, correct front-panel wiring and GPU power. Confirm cables are clear of blades. First boot and BIOS checks happen only with teacher approval."],["Disassemble carefully","Record cable positions, fully disconnect power, release clips and screws as instructed, support the weight of expansion cards, keep parts organized, and avoid prying sockets or forcing connectors."]],activity:"Use UnitLab's 3D Workbench to rehearse identify → disconnect → remove → inspect → reinstall. Follow the approved physical-lab procedure for real performance assessment.",check:"Why must motherboard standoff positions be checked before mounting the board?",resource:"assembly-slides",codes:"TESDA CSS NC II — assemble computer hardware; DepEd LAS39 cable connections"},
{title:"Inspection, Maintenance & Reflection",unit:"06 / QUALITY CHECK",time:"35–45 min",target:"Inspect assembled hardware safely, document faults and reflect on servicing decisions.",outcomes:["Prepare a pre-power-on visual inspection checklist.","Explain basic POST, BIOS and connector checks without performing unsafe tests.","Document an observed issue, corrective action and resulting verification."],content:[["Check before start-up","Inspect for dropped screws, disconnected CPU fans, loose RAM, unmatched power cables or blocked fans. Never energize damaged equipment or bypass safety interlocks."],["Use evidence, not guesses","A no-display condition can have several causes: monitor, cable, GPU output selection, RAM seating, power or firmware compatibility. Troubleshooting should follow a written decision tree and approved procedures."],["Document the result","Use a clear record: symptom → observation → possible cause → controlled check → finding → next action. If a check requires working near energized components or opening high-voltage equipment, stop and refer to qualified personnel."],["Connect to research","Virtual quizzes are formative; actual practical performance changes in the CBAR study require supervised pretest and posttest observations with the same adopted scoring standards."]],activity:"Create a short inspection checklist and a fault report for a system that powers up but has no display. Give a safe first check.",check:"Explain why a virtual quiz score cannot replace an observed assembly performance rubric.",resource:"assembly-slides",codes:"CSS quality standards and maintaining computer systems"}
];
const PLANS=[
{title:"OHS and Safe Workstation Preparation",grade:"Grade 9 TLE / Grade 11 CSS",duration:"60 minutes",competency:"Prepare workplace, use tools and implement OHS procedures before assembling hardware.",objectives:["Identify at least four PC-servicing hazards.","Demonstrate a safe equipment-isolation checklist in sequence.","Distinguish PPE from ESD protection."],materials:"Projector, unplugged demonstration PC, approved ESD controls and tool kit, TESDA self-assessment guide and MSI step-by-step PC building guide.",flow:[["Engage · 5 min","Show an image of an unsafe workstation (liquid near PC, clutter, loose cable). Ask learners to spot risks."],["Explore · 10 min","Pairs sort tools, PPE and ESD controls by function. Teacher corrects misconceptions about electrical isolation."],["Explain · 15 min","Discuss shutdown, unplugging, ESD control, hazards, safe handling and the never-open-PSU rule."],["Elaborate · 20 min","Groups prepare a safe bench using unpowered equipment and complete the UnitLab safety checklist."],["Evaluate · 10 min","Learners sequence six safe preparation actions and justify two precautions. Give immediate feedback."]],assessment:"Checklist: power isolated; workspace clean/dry; appropriate PPE selected; ESD procedure followed; tools organized. Teacher observes and scores using the approved class rubric.",ref:["tesda-sag","tesda-regs","ohs-slides"]},
{title:"Identify the Parts of a System Unit",grade:"Grade 9 TLE / Grade 11 CSS",duration:"60 minutes",competency:"Identify system-unit components and functions as preparation for hardware assembly.",objectives:["Locate and label at least eight components.","Match each component with its role.","Explain CPU socket and RAM generation as examples of compatibility."],materials:"MSI illustrated build tutorial, Crucial RAM installation PDF, ASUS CPU installation guide, projector, UnitLab PC Builder and parts diagram.",flow:[["Review · 5 min","Recall basic workbench safety and equipment isolation."],["Motivate · 10 min","Show motherboard and component images; invite predictions of names and functions."],["Discuss · 15 min","Explain motherboard, CPU, RAM, SSD, GPU, PSU, case and cooling, including main connectors."],["Practice · 20 min","Learners inspect selected parts in the PC builder and create a labeled parts-function matching table."],["Assess · 10 min","Give an eight-item identification exercise and ask each learner to explain one component to a peer."]],assessment:"Formative identification activity and oral explanation. Physical identification must be verified on unpowered real equipment under supervision.",ref:["msi-build","crucial-ram","tesda-regs"]},
{title:"Assembling Computer Hardware",grade:"Grade 11 CSS / SHS TVL-ICT",duration:"90 minutes (adjust to timetable)",competency:"Install and configure computer systems — LO1: Assemble Computer Hardware.",objectives:["Prepare a compatible parts list and tools.","Demonstrate an orderly simulated assembly sequence.","Identify at least five checks required before initial power-on."],materials:"TESDA CSS NC II self-assessment guide, SlideShare assembly presentation (illustrative only), MSI build guide, official component manuals, UnitLab workbench and supervised unpowered trainer.",flow:[["Prepare · 10 min","Check PPE and ESD measures; review compatible CPU socket, memory and power connections."],["Demonstrate · 20 min","Teacher models case preparation, correct standoffs, CPU/RAM and cooler installation, board installation and cabling following manual-specific steps."],["Guided practice · 20 min","Learners rehearse removal/reassembly in the UnitLab 3D simulation with safety reminders."],["Lab application · 30 min","Under supervision, assigned groups practice on unplugged approved equipment using a competency checklist; stop at unsafe conditions."],["Closure · 10 min","Learners conduct an inspection and reflection: what was checked, what was difficult, and what needs practice."]],assessment:"Observed performance rubric to cover identification, safety, disassembly and reassembly. Use the adopted instrument approved for the study; do not substitute the simulator quiz.",ref:["assembly-slides","msi-build","tesda-sag"]}
];
const TOOLS=[
["✚","Phillips screwdriver","Choose a properly fitting size; remove case, drive and motherboard screws without slipping.","Hand tool"],["⛨","ESD mat","Provides an approved grounded or dissipative work surface to reduce component damage from static discharge.","ESD control"],["◷","ESD wrist strap","Use only as directed for grounded component handling with equipment isolated from mains power.","ESD control"],["⊞","Screw organizer","Store different screw types separately to avoid wrong fasteners and dropped screws.","Preparation"],["◉","Flashlight","Inspect labels, standoffs and connector locations in dim enclosure corners.","Inspection"],["◇","Nylon spudger","Gently move cables or release suitable plastic clips where the manufacturer permits.","Hand tool"],["⌁","Cable ties / hook-and-loop","Organize cables away from cooling fans without overtightening.","Finishing"],["◌","Lint-free cloth","Remove dust or residue using approved cleaning guidance; keep moisture away from power.","Cleaning"],["▣","Multimeter","For trained users and authorized tests only; not a reason to probe live PSU interiors.","Diagnostics"]
];
const PPE=[
["◉","Protective eyewear","Use where dust, flying particles or compressed-air procedures pose an eye hazard.","PPE"],["⌑","Closed-toe footwear","Appropriate footwear helps prevent minor foot injuries and contact with dropped objects.","PPE"],["▥","ESD wrist strap and mat","Electronics protection from electrostatic discharge; not electrical shock PPE.","ESD"],["≋","Dust mask / respiratory protection","Use when school risk assessment requires protection during dusty cleaning; follow approved procedures.","Risk-based PPE"],["↗","Ventilation","Ventilate where approved cleaning products or aerosols are used; observe product labels.","Engineering control"],["⚡","Power isolation","Shut down and unplug. Never open PSU housing; stored energy hazards can remain even disconnected.","Mandatory safety control"]
];
const CHECKS=["I have shut down the PC, disconnected mains power and removed peripherals.","The workspace is dry, stable, clean and free of food and drinks.","I checked the teacher's OHS instructions and obtained supervision where required.","I selected correctly sized tools and appropriate PPE.","I prepared approved ESD controls and understand their safe use.","I checked component and manufacturer manuals before starting.","I will not open the power supply enclosure or force connectors."];
const SHOP="https://easypc.com.ph/pages/pricelist";
const CAT=[
{key:"cpu",title:"Processor / CPU",options:[
{id:"r5600",name:"AMD Ryzen 5 5600",price:6995,socket:"AM4",watts:65,igpu:false,desc:"6-core Zen 3 processor; AM4 socket; dedicated graphics required.",url:"https://bermorzone.com.ph/shop/processors/amd-processors/amd-ryzen-5-5600-6-core-3-5-ghz-socket-am4-65w-100-100000927box-desktop-processor/?attribute_variant=Processor+%26+Cooler+Only",verified:true},
{id:"r5600gt",name:"AMD Ryzen 5 5600GT",price:8695,socket:"AM4",watts:65,igpu:true,desc:"AM4 desktop APU with integrated Radeon graphics for systems without a separate GPU.",url:"https://bermorzone.com.ph/shop/",verified:true},
{id:"r7600",name:"AMD Ryzen 5 7600",price:10995,socket:"AM5",watts:65,igpu:true,desc:"AM5 Ryzen 7000 processor supporting DDR5 platforms; basic integrated graphics.",url:"https://bermorzone.com.ph/shop/processors/amd-processors/amd-ryzen-5-7600-3-8ghz-up-to-5-1ghz-socket-am5-processor-100-000001015box/?attribute_stock=Retail+Box",verified:true}
]},
{key:"board",title:"Motherboard",options:[
{id:"b550",name:"MSI B550M PRO-VDH WiFi",price:6495,socket:"AM4",ram:"DDR4",form:"mATX",desc:"AM4 micro-ATX board with DDR4 support and M.2 connectivity. Example listing was out of stock.",url:"https://bermorzone.com.ph/shop/motherboard/amd-motherboards/msi-b550m-pro-vdh-wifi-proseries-motherboard/",verified:true},
{id:"b650",name:"Gigabyte B650M Gaming WiFi",price:6595,socket:"AM5",ram:"DDR5",form:"mATX",desc:"AM5 micro-ATX board with DDR5 and PCIe M.2 support.",url:"https://bermorzone.com.ph/shop/motherboard/amd-motherboards/gigabyte-b650m-gaming-wifi-amd-ryzen-9000-series-am5-micro-atx-motherboard/",verified:true},
{id:"b650d",name:"Gigabyte B650M D3HP",price:7495,socket:"AM5",ram:"DDR5",form:"mATX",desc:"AM5 micro-ATX motherboard with DDR5 and PCIe 4.0 M.2.",url:"https://bermorzone.com.ph/shop/motherboard/amd-motherboards/gigabyte-b650m-d3hp-amd-am5-motherboard/",verified:true}
]},
{key:"ram",title:"System Memory / RAM",options:[
{id:"ddr4_16",name:"Kingston FURY Beast 16GB (2×8) DDR4-3200",price:2800,ram:"DDR4",desc:"Dual-channel 16GB DDR4 example kit. Speed support depends on board/CPU.",url:SHOP,verified:false},
{id:"ddr4_32",name:"Kingston FURY Beast 32GB (2×16) DDR4-3200",price:4800,ram:"DDR4",desc:"Larger capacity DDR4 kit suitable for compatible AM4 boards.",url:SHOP,verified:false},
{id:"ddr5_16",name:"Kingston FURY Beast 16GB (2×8) DDR5-5200",price:4300,ram:"DDR5",desc:"DDR5 kit for AM5 boards; illustrative classroom pricing.",url:SHOP,verified:false},
{id:"ddr5_32",name:"Kingston FURY Beast 32GB (2×16) DDR5-5600",price:6800,ram:"DDR5",desc:"32GB DDR5 memory kit for compatible systems.",url:SHOP,verified:false}
]},
{key:"gpu",title:"Graphics Processor / GPU",options:[
{id:"none",name:"Integrated graphics / no dedicated GPU",price:0,watts:0,length:0,desc:"No add-in graphics card. Only suitable for display when the chosen CPU has integrated graphics.",url:SHOP,verified:false},
{id:"rx7600",name:"ASUS Dual Radeon RX 7600 8GB",price:17950,watts:165,length:245,desc:"8GB discrete graphics card. Confirm power cable and clearance against exact model.",url:"https://bermorzone.com.ph/shop/",verified:true},
{id:"rtx4060",name:"NVIDIA GeForce RTX 4060 8GB (example)",price:19950,watts:115,length:245,desc:"RTX 4060-class 8GB discrete GPU. Price and card dimensions illustrative by partner variant.",url:SHOP,verified:false},
{id:"rtx5060",name:"NVIDIA GeForce RTX 5060 8GB (example)",price:24500,watts:145,length:260,desc:"RTX 5060-class GPU. Example, not a live price or specific partner card.",url:SHOP,verified:false}
]},
{key:"storage",title:"Storage",options:[
{id:"sn580_500",name:"WD Blue SN580 NVMe SSD 500GB",price:1979,desc:"M.2 NVMe PCIe Gen4 SSD example; listed product page covers 500GB–1TB variants.",url:"https://bermorzone.com.ph/shop/storage-devices/solid-state-drives/western-digital-blue-sn580-500gb-1tb-pcie-gen4-x4-nvme-m-2-2280-solid-state-drive/",verified:false},
{id:"sn580_1t",name:"WD Blue SN580 NVMe SSD 1TB",price:4695,desc:"1TB M.2 NVMe SSD. Value represents the upper end of a multi-variant listing, not a verified 1TB checkout quote.",url:"https://bermorzone.com.ph/shop/storage-devices/solid-state-drives/western-digital-blue-sn580-500gb-1tb-pcie-gen4-x4-nvme-m-2-2280-solid-state-drive/",verified:false},
{id:"mx500",name:"Crucial MX500 SATA SSD 1TB",price:4795,desc:"2.5-inch SATA SSD example; requires SATA data and power cables.",url:SHOP,verified:false}
]},
{key:"psu",title:"Power Supply / PSU",options:[
{id:"cx650",name:"Corsair CX650 ATX 3.1 650W",price:3590,capacity:650,desc:"650W ATX PSU; example listing indicates modern PCIe power connections. Check availability.",url:"https://bermorzone.com.ph/shop/power-sources/power-supply-unit/corsair-cx650-atx-3-1-cybenetics-gold-power-supply-black/",verified:true},
{id:"psu550",name:"Cooler Master MWE 550W (example)",price:3150,capacity:550,desc:"550W PSU planning example; exact connector and wattage profile must be checked.",url:SHOP,verified:false},
{id:"psu750",name:"Corsair RM750e 750W (example)",price:6995,capacity:750,desc:"750W class PSU planning example for builds needing higher margin.",url:SHOP,verified:false}
]},
{key:"case",title:"System Case / Chassis",options:[
{id:"mcase",name:"Micro-ATX airflow case (example)",price:2495,forms:["mATX","mini-ITX"],gpuMax:270,desc:"Classroom sample mATX tower. Assumed 270mm maximum GPU clearance for learning; verify specific model.",url:SHOP,verified:false},
{id:"atxcase",name:"ATX mid-tower airflow case (example)",price:3995,forms:["ATX","mATX","mini-ITX"],gpuMax:340,desc:"Example larger enclosure; supports common ATX and micro-ATX boards. Clearance is model-dependent.",url:SHOP,verified:false},
{id:"smallcase",name:"Compact micro-ATX case (example)",price:1995,forms:["mATX","mini-ITX"],gpuMax:220,desc:"Compact sample case: narrower GPU clearance. Illustration is not a specific product listing.",url:SHOP,verified:false}
]},
{key:"cooler",title:"CPU Cooling",options:[
{id:"stock",name:"AMD stock Wraith cooler (if included)",price:0,sockets:["AM4","AM5"],desc:"Illustrates a supported boxed CPU cooler; confirm that the selected package actually includes one.",url:SHOP,verified:false},
{id:"tower",name:"ID-COOLING SE-214-XT tower air cooler",price:950,sockets:["AM4","AM5"],desc:"Aftermarket tower cooler example. Check exact included AM5/AM4 mounting kit and case height.",url:"https://bermorzone.com.ph/shop/",verified:true}
]}
];
const QUIZ=[
{q:"Which two specifications must match for a CPU to fit its motherboard?",choices:["CPU socket and motherboard socket","GPU clock and SSD capacity","Case color and RAM branding","Monitor size and PSU model"],ok:0,why:"Socket compatibility is a first check. Also confirm motherboard firmware and CPU support lists."},
{q:"An AM5 motherboard normally supports which memory generation in this classroom catalog?",choices:["DDR2","DDR3","DDR4","DDR5"],ok:3,why:"The AM5 motherboards in this catalog use DDR5 DIMMs; DDR4 cannot be installed in DDR5 slots."},
{q:"What should you do before opening a PC case to handle memory?",choices:["Keep the PC running to retain settings","Disconnect power and apply lab safety/ESD procedures","Remove the PSU housing","Spray cleaning liquid on the powered board"],ok:1,why:"Isolate the PC from mains power and follow the supervised ESD and OHS procedure."},
{q:"Which component supplies electrical power to installed PC components?",choices:["Motherboard I/O shield","Solid-state drive","Power supply unit","RAM"],ok:2,why:"The PSU converts AC mains into regulated low-voltage DC output. Do not open its housing."},
{q:"If you choose a CPU without integrated graphics and no graphics card, what is a likely issue?",choices:["No usable display output","Faster boot time","More storage capacity","RAM becomes DDR5"],ok:0,why:"A CPU without integrated graphics generally needs a separate GPU for display output."},
{q:"What is the safest action if a connector will not fit during assembly?",choices:["Force it harder","Trim the plastic key","Stop and recheck orientation and compatibility","Bypass the clip using metal tools"],ok:2,why:"Connectors are keyed. Stop instead of forcing parts and check manufacturer instructions."},
{q:"What is the key purpose of a motherboard standoff?",choices:["Increase GPU performance","Keep the motherboard safely separated from the case metal","Cool the SSD","Add Wi-Fi"],ok:1,why:"Correct standoff placement supports the board and helps prevent unintended electrical contact with the chassis."},
{q:"Are UnitLab knowledge-check results equivalent to your CBAR practical pretest/posttest scores?",choices:["Yes, always","Only if the learner scores 100%","No, practical assessment requires the adopted rubric and direct observation","Yes, because it uses DepEd references"],ok:2,why:"Computer servicing skills require direct observed performance. Formative quiz data are separate."}
];
const state={page:"home",student:sessionStorage.getItem("unitlab3d_student_demo")||"",module:0,plan:0,quiz:0,answer:null,correct:0,completed:false,focus:"cpu"};
const money=n=>"₱"+Number(n).toLocaleString("en-PH");
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const findProduct=(key,id)=>CAT.find(c=>c.key===key).options.find(p=>p.id===id);
const defaults=Object.fromEntries(CAT.map(c=>[c.key,c.options[0].id]));
let build={...defaults,cpu:"r5600",board:"b550",ram:"ddr4_16",gpu:"rtx4060",storage:"sn580_500",psu:"cx650",case:"mcase",cooler:"stock"};
function selected(key){return findProduct(key,build[key])}
function toast(s){const el=$("#toast");el.textContent=s;el.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove("show"),2800)}
function progressKey(){return "unitlab3d_demo_progress_"+state.student}
function getProgress(){if(!state.student)return {modules:[],best:null,build:null};try{return JSON.parse(localStorage.getItem(progressKey()))||{modules:[],best:null,build:null}}catch{return {modules:[],best:null,build:null}}}
function setProgress(p){if(state.student)localStorage.setItem(progressKey(),JSON.stringify(p))}
function authUI(){$("#userBadge").textContent=state.student||"Guest";$("#loginTop").hidden=!!state.student;$("#logoutTop").hidden=!state.student;$("#loginSidebar").textContent=state.student?"↩ Sign out ("+state.student+")":"⌁ Student sign in"}
function showLogin(){$("#authModal").hidden=false;$("#loginCode").focus()}
function closeLogin(){$("#authModal").hidden=true}
function login(e){e.preventDefault();const code=$("#loginCode").value.trim().toUpperCase();if(!/^[A-Z0-9_-]{3,24}$/.test(code)){toast("Use 3–24 letters, digits, hyphens or underscores.");return}state.student=code;sessionStorage.setItem("unitlab3d_student_demo",code);closeLogin();authUI();renderModules();renderQuiz();toast("Signed into local demo as "+code)}
function logout(){state.student="";sessionStorage.removeItem("unitlab3d_student_demo");authUI();renderModules();renderQuiz();toast("Demo profile signed out on this tab")}
const LEARNING_ROUTES=new Set(["modules","plans","curriculum","safety","quiz"]);
function closeRail(){const rail=$("#primaryRail"),scrim=$("#railScrim"),button=$("#menuToggle");if(rail)rail.classList.remove("open");if(scrim)scrim.hidden=true;if(button){button.setAttribute("aria-expanded","false");button.setAttribute("aria-label","Open navigation")}}
function toggleRail(){const rail=$("#primaryRail"),scrim=$("#railScrim"),button=$("#menuToggle");if(!rail||!button)return;const open=!rail.classList.contains("open");rail.classList.toggle("open",open);if(scrim)scrim.hidden=!open;button.setAttribute("aria-expanded",String(open));button.setAttribute("aria-label",open?"Close navigation":"Open navigation")}
function toggleLearning(expanded){const links=$("#learnLinks"),toggle=$("#learnToggle");if(!links||!toggle)return;links.hidden=!expanded;toggle.setAttribute("aria-expanded",String(expanded));toggle.classList.toggle("expanded",expanded)}
function navigate(page){if(page==="home"){window.location.assign("hub-v2.html");return}if(!$("#view-"+page))return;
state.page=page;$$(".view").forEach(e=>e.classList.toggle("active",e.id==="view-"+page));
$$("[data-go]").forEach(e=>e.classList.toggle("active",e.classList.contains("nav-button")&&e.dataset.go===page));
/* Learning, Builder and Lab now share flat navigation, matching the main hub. */
const names={home:"Home",modules:"Learning Modules",plans:"Lesson Plans",curriculum:"DepEd Resources",builder:"PC Builder",workbench:"3D Workbench",safety:"Tools & PPE",quiz:"Knowledge Check"};
$("#pageCrumb").textContent=names[page]||page;closeRail();scrollTo({top:0,behavior:"instant"});
if(page==="builder")renderBuilder();if(page==="modules")renderModules();if(page==="plans")renderPlans();if(page==="quiz")renderQuiz();if(page==="safety")renderChecklist();
if(page==="workbench"){const frame=$("#labFrame");if(frame&&!frame.getAttribute("src"))frame.setAttribute("src",frame.dataset.src)}
if(location.hash!=="#"+page)location.hash=page;
}
function source(id){return RESOURCES.find(r=>r.id===id)}
function resourceAction(r){return r.kind==="slides"?"View the slides ↗":r.kind==="pdf"?"Open actual PDF ↗":"Read the guide ↗"}
function sourceStatus(r){return r.level==="official"?"OFFICIAL PDF":r.level==="manufacturer"?"MANUFACTURER SOURCE":"INDEPENDENT PRESENTATION"}
function sourceKind(r){return r.kind==="slides"?"PRESENTATION":r.kind==="pdf"?"PDF DOCUMENT":"LEARNING GUIDE"}
function srcLink(id,label){const r=source(id);return r?'<a href="'+esc(r.url)+'" target="_blank" rel="noopener noreferrer">'+esc(label||r.title)+' ('+esc(sourceKind(r).toLowerCase())+') ↗</a>':""}
function moduleResourceLinks(index){
 const items=RESOURCES.filter(r=>r.lessons.includes(index)).sort((a,b)=>(b.featured?1:0)-(a.featured?1:0));
 const slides=items.filter(r=>r.kind==="slides");
 const pdfs=items.filter(r=>r.kind==="pdf");
 const guides=items.filter(r=>r.kind==="guide");
 const selected=[...slides.slice(0,2),...pdfs.slice(0,3),...guides.slice(0,3)].slice(0,8);
 const cards=selected.map(r=>'<article class="lesson-media-card'+(r.featured?" featured":"")+'"><div class="lesson-media-label"><span class="media-kind type-'+esc(r.kind)+'">'+esc(sourceKind(r))+'</span><span>'+esc(sourceStatus(r))+'</span></div><h4>'+esc(r.title)+'</h4><p>'+esc(r.description)+'</p><small>'+esc(r.detail)+'</small><div class="lesson-media-controls"><a class="lesson-media-open" href="'+esc(r.url)+'" target="_blank" rel="noopener noreferrer">'+esc(resourceAction(r))+'</a>'+(r.kind==="pdf"?'<button type="button" class="lesson-preview-btn" data-preview-pdf="'+esc(r.id)+'">Preview PDF here</button>':"")+'</div>'+(r.level==="thirdparty"?'<p class="lesson-provider-note">Independently uploaded slides. This is not an official DepEd/TESDA module. Follow current safety and manufacturer guidance.</p>':"")+'</article>').join("");
 return '<section class="lesson-source-box" aria-label="Real lesson materials"><div class="source-box-head"><b>REAL LEARNING MATERIALS FOR THIS LESSON</b><small>Working presentation pages, PDF documents and step-by-step guides</small></div><p class="lesson-source-intro">Open the actual source, not a description-only catalog record. SlideShare downloads may require sign-in, but the presentations are viewable online.</p><div class="lesson-media-grid">'+cards+'</div><div id="pdfPreviewArea" class="lesson-pdf-preview" hidden></div><p class="lesson-media-footnote"><b>Safety note:</b> some independently uploaded presentations include dated or unsafe ESD advice (such as working on carpeting or on antistatic packaging). Use school OHS procedures and the component manufacturers’ instructions instead.</p></section>';
}
function setupModulePDFPreview(){
 $$("[data-preview-pdf]").forEach(button=>button.addEventListener("click",()=>{
  const r=source(button.dataset.previewPdf);
  if(!r||r.kind!=="pdf")return;
  const box=$("#pdfPreviewArea");if(!box)return;
  box.hidden=false;
  box.innerHTML='<div class="pdf-preview-heading"><strong>'+esc(r.title)+'</strong><button type="button" id="closePdfPreview">Close ×</button></div><p>If the publisher blocks embedding, use the link below to open the original file.</p><iframe title="'+esc(r.title)+'" src="'+esc(r.url)+'" loading="lazy" referrerpolicy="no-referrer"></iframe><a href="'+esc(r.url)+'" target="_blank" rel="noopener noreferrer">Open original PDF in new tab ↗</a>';
  $("#closePdfPreview").addEventListener("click",()=>{box.hidden=true;box.innerHTML=""});
  box.scrollIntoView({behavior:"smooth",block:"nearest"});
 }));
}
function renderResources(){
 const q=($("#resourceSearch")?.value||"").trim().toLowerCase();
 const shown=RESOURCES.filter(r=>(resourceFilter==="all"||r.kind===resourceFilter)&&[r.title,r.description,r.detail,r.agency].join(" ").toLowerCase().includes(q));
 const filters=$("#resourceFilters");
 if(filters){
  filters.innerHTML=RESOURCE_FILTERS.map(f=>'<button type="button" class="resource-filter'+(resourceFilter===f[0]?' selected':'')+'" data-resource-filter="'+f[0]+'" aria-pressed="'+(resourceFilter===f[0])+'">'+esc(f[1])+'</button>').join("");
  $$("[data-resource-filter]",filters).forEach(btn=>btn.addEventListener("click",()=>{resourceFilter=btn.dataset.resourceFilter;renderResources()}));
 }
 $("#resourceCount").textContent=shown.length+" reviewed "+(shown.length===1?"material":"materials")+" available";
 $("#resourcesGrid").innerHTML=shown.map(r=>{
  return '<article class="resource-card"><div class="resource-card-top"><span class="resource-type type-'+esc(r.kind)+'">'+esc(sourceKind(r))+'</span><span>'+esc(r.agency)+'</span></div><div class="res-kicker">'+esc(sourceStatus(r))+'</div><h3>'+esc(r.title)+'</h3><p>'+esc(r.description)+'</p><small>'+esc(r.detail)+'</small><div class="resource-actions"><a class="resource-open" href="'+esc(r.url)+'" target="_blank" rel="noopener noreferrer">'+esc(resourceAction(r))+'</a></div><div class="resource-file-note">'+esc(r.access)+'</div></article>';
 }).join("")||'<p class="resource-no-match">No available materials match your search. Try another keyword.</p>';
 const map=[["Use Hand Tools","Lesson 4 · safe preparation and tool selection"],["Apply Quality Standards","Lesson 6 · inspect, document and verify"],["Install and Configure Computer Systems","Lessons 2, 3 and 5 · component identification, compatibility and assembly"],["OHS and safety procedures","Lessons 1 and 4 · workplace hazards and ESD control"]];
 $("#competencyMap").innerHTML=map.map(x=>'<div class="mapping-card"><b>'+esc(x[0])+'</b><p>'+esc(x[1])+'</p></div>').join("");
}
function renderModules(){const saved=getProgress();$("#moduleList").innerHTML=MODULES.map((m,i)=>'<button class="lesson-tab '+(i===state.module?"active":"")+'" data-mod="'+i+'"><strong>'+(i+1)+'. '+esc(m.title)+(saved.modules&&saved.modules.includes(i)?" ✓":"")+'</strong><small>'+esc(m.unit)+' · '+esc(m.time)+'</small></button>').join("");const m=MODULES[state.module];$("#moduleBody").innerHTML='<div class="lesson-meta">'+esc(m.unit)+' · '+esc(m.time)+'</div><h2>'+esc(m.title)+'</h2><p><b>Learning competency:</b> '+esc(m.target)+'</p>'+moduleResourceLinks(state.module)+'<h3>Learning objectives</h3><ul class="obj-list">'+m.outcomes.map(x=>"<li>"+esc(x)+"</li>").join("")+'</ul>'+m.content.map(x=>"<h3>"+esc(x[0])+"</h3><p>"+esc(x[1])+"</p>").join("")+'<div class="activity-box"><b>✎ Apply / performance practice</b><p>'+esc(m.activity)+'</p><b>Reflect / knowledge check</b><p>'+esc(m.check)+'</p></div><p class="score-note">Competency connection: '+esc(m.codes)+'</p><div class="paper-actions"><button class="btn solid" id="completeModule">'+(saved.modules&&saved.modules.includes(state.module)?"✓ Completed — continue":"Mark studied ✓")+'</button><button class="btn outline" id="nextModule">Next module →</button></div><p class="score-note">A completed module flag records self-reported study only, not a verified practical competency.</p>';$$("[data-mod]").forEach(b=>b.addEventListener("click",()=>{state.module=Number(b.dataset.mod);renderModules()}));$("#completeModule").addEventListener("click",()=>{if(!state.student){showLogin();return}const p=getProgress();p.modules=p.modules||[];if(!p.modules.includes(state.module))p.modules.push(state.module);setProgress(p);toast("Module progress saved to local demo profile");renderModules()});$("#nextModule").addEventListener("click",()=>{state.module=(state.module+1)%MODULES.length;renderModules()});setupModulePDFPreview()}
function renderPlans(){$("#planList").innerHTML=PLANS.map((p,i)=>'<button class="lesson-tab '+(state.plan===i?"active":"")+'" data-plan="'+i+'"><strong>'+esc(p.title)+'</strong><small>'+esc(p.grade)+' · '+esc(p.duration)+'</small></button>').join("");const p=PLANS[state.plan];$("#planBody").innerHTML='<div class="lesson-meta">UNITLAB TEACHER-READY PLAN · '+esc(p.grade)+'</div><h2>'+esc(p.title)+'</h2><p><b>Duration:</b> '+esc(p.duration)+'</p><p><b>Curriculum alignment:</b> '+esc(p.competency)+'</p><h3>I. Learning Objectives</h3><ol class="obj-list">'+p.objectives.map(x=>"<li>"+esc(x)+"</li>").join("")+'</ol><h3>II. Learning Resources</h3><p>'+esc(p.materials)+'</p><h3>III. Teaching-Learning Procedure</h3>'+p.flow.map(x=>'<div class="activity-box"><b>'+esc(x[0])+'</b><p>'+esc(x[1])+'</p></div>').join("")+'<h3>IV. Assessment</h3><p>'+esc(p.assessment)+'</p><h3>V. Reflection & Differentiation</h3><p>After the activity, record learner misconceptions, time constraints and support needed. Provide a guided version for learners needing more practice, with an extension activity for students who show readiness.</p><h3>VI. Supporting Learning References (Official and Third-Party)</h3><ul>'+p.ref.map(id=>'<li>'+srcLink(id)+'</li>').join("")+'</ul><p class="score-note">This is an original instructional adaptation prepared for UnitLab, NOT an official DepEd lesson-plan publication. Check the lesson-plan format required by your school.</p><div class="paper-actions"><button class="btn solid" id="printPlan">⇩ Print / Save to PDF</button><button class="btn outline" id="nextPlan">Next lesson plan →</button></div>';$$("[data-plan]").forEach(b=>b.addEventListener("click",()=>{state.plan=Number(b.dataset.plan);renderPlans()}));$("#printPlan").addEventListener("click",()=>window.print());$("#nextPlan").addEventListener("click",()=>{state.plan=(state.plan+1)%PLANS.length;renderPlans()})}
function priceTag(p){return p.verified?"Retailer listing (snapshot)":"Illustrative estimate"}
function renderBuilder(){$("#catalogCount").textContent=CAT.reduce((n,c)=>n+c.options.length,0);$("#builderFields").innerHTML='<div class="builder-field"><div class="field-head"><label>Start with a sample configuration</label></div><div class="builder-actions"><button class="btn outline small" data-preset="budget">AM4 integrated</button><button class="btn outline small" data-preset="gaming">AM4 gaming</button><button class="btn outline small" data-preset="am5">Modern AM5</button></div></div>'+CAT.map((cat,i)=>{let p=selected(cat.key);return '<div class="builder-field"><div class="field-head"><label for="choose-'+cat.key+'">'+String(i+1).padStart(2,"0")+' · '+esc(cat.title)+'</label><small>'+money(p.price)+'</small></div><select id="choose-'+cat.key+'" data-cat="'+cat.key+'">'+cat.options.map(o=>'<option value="'+o.id+'" '+(o.id===build[cat.key]?"selected":"")+'>'+esc(o.name)+' · '+money(o.price)+'</option>').join("")+'</select><div class="spec-line">'+esc(p.desc)+'</div><div class="price-source"><span>'+priceTag(p)+'</span><a href="'+esc(p.url)+'" target="_blank" rel="noopener">Check source ↗</a></div></div>'}).join("");$$("[data-cat]").forEach(s=>s.addEventListener("change",()=>{build[s.dataset.cat]=s.value;state.focus=s.dataset.cat;renderBuilder()}));$$("[data-preset]").forEach(b=>b.addEventListener("click",()=>{const d=b.dataset.preset;build=d==="budget"?{cpu:"r5600gt",board:"b550",ram:"ddr4_16",gpu:"none",storage:"sn580_500",psu:"psu550",case:"mcase",cooler:"stock"}:d==="am5"?{cpu:"r7600",board:"b650",ram:"ddr5_32",gpu:"none",storage:"sn580_1t",psu:"cx650",case:"atxcase",cooler:"stock"}:{cpu:"r5600",board:"b550",ram:"ddr4_32",gpu:"rx7600",storage:"sn580_1t",psu:"cx650",case:"atxcase",cooler:"tower"};state.focus="cpu";renderBuilder()}));const total=CAT.reduce((n,c)=>n+selected(c.key).price,0);$("#totalCost").textContent=money(total);renderPC();checkCompatibility();renderPartInfo()}
function renderPC(){const gpu=selected("gpu");const board=selected("board");const cpu=selected("cpu");const psu=selected("psu");$("#pcVisualizer").innerHTML='<div class="case-model" aria-label="Stylized side-view system unit with selected component classes"><div class="case-top-led"></div><div class="case-glass"><div class="motherboard-visual" title="'+esc(board.name)+'"><div class="mb-label">'+esc(board.socket)+' • '+esc(board.ram)+'</div><div class="cpu-visual" title="'+esc(cpu.name)+'">CPU</div><div class="ram-visual"><i></i><i></i></div><div class="gpu-visual '+(gpu.id==="none"?"hide-card":"")+'" title="'+esc(gpu.name)+'">'+(gpu.id==="none"?"NO GPU":esc(gpu.name.split(" ").slice(-2).join(" ")))+'</div><div class="storage-visual" title="M.2 storage"></div></div><div class="fan-visual"><i></i><i></i></div><div class="psu-visual" title="'+esc(psu.name)+'">PSU '+esc(String(psu.capacity))+'W</div></div></div>'}
function checkCompatibility(){const cpu=selected("cpu"),board=selected("board"),ram=selected("ram"),gpu=selected("gpu"),psu=selected("psu"),pcase=selected("case"),cooler=selected("cooler");const check=[];function add(type,label){check.push({type,label})}add(cpu.socket===board.socket?"ok":"bad","CPU socket "+cpu.socket+" vs motherboard socket "+board.socket+(cpu.socket===board.socket?" — matches.":" — mismatch."));add(ram.ram===board.ram?"ok":"bad","Memory "+ram.ram+" vs motherboard "+board.ram+(ram.ram===board.ram?" — matches.":" — mismatch."));add(gpu.id!=="none"||cpu.igpu?"ok":"bad",gpu.id==="none"?(cpu.igpu?"CPU has integrated graphics; display output depends on board/ports.":"CPU needs a separate graphics card for usable display output."):"Dedicated graphics card chosen.");let estimate=cpu.watts+gpu.watts+90;add(psu.capacity>=Math.ceil(estimate*1.3)?"ok":"bad","Illustrative load ≈ "+estimate+"W; 30% headroom target ≈ "+Math.ceil(estimate*1.3)+"W vs "+psu.capacity+"W PSU. Connectors/rail quality still need checking.");add(pcase.forms.includes(board.form)?"ok":"bad","Board form factor "+board.form+(pcase.forms.includes(board.form)?" fits selected example case.":" does not fit the selected case."));add(gpu.length<=pcase.gpuMax?"ok":"bad","Example graphics-card length "+gpu.length+"mm vs case clearance "+pcase.gpuMax+"mm.");add(cooler.sockets.includes(cpu.socket)?"ok":"bad","Cooling mounting covers socket "+cpu.socket+". Verify case height, CPU package and mounting hardware.");add("warn","Verify motherboard BIOS revision, PSU cabling, cooling clearance, M.2 support and vendor stock against exact SKUs.");const errors=check.filter(x=>x.type==="bad");$("#buildRating").textContent=errors.length?errors.length+" ISSUE"+(errors.length===1?"":"S"):"BASIC CHECKS PASS";$("#buildRating").style.background=errors.length?"#60313a":"#1a5950";$("#compatibilityPanel").innerHTML='<h3>'+ (errors.length?"Compatibility warnings":"Basic compatibility checks passed")+'</h3>'+check.map(x=>'<div class="check-result"><span class="'+x.type+'">'+(x.type==="ok"?"✓":x.type==="bad"?"✕":"!")+'</span><span>'+esc(x.label)+'</span></div>').join("")}
function renderPartInfo(){let p=selected(state.focus);$("#selectedDetail").innerHTML='<div class="eyebrow">SELECTED COMPONENT DETAIL</div><h3>'+esc(p.name)+'</h3><p>'+esc(p.desc)+'</p><p><b>Reference price:</b> '+money(p.price)+' · '+priceTag(p)+'.</p><p><a href="'+esc(p.url)+'" target="_blank" rel="noopener">View retailer/reference listing ↗</a></p><p>Selection and fit checks are educational only; verify exact revision, support and connector details before purchase.</p>'}
function saveBuild(){if(!state.student){showLogin();return}const p=getProgress();p.build={...build};setProgress(p);toast("Build saved in local browser demo profile")}
function downloadBuild(){const lines=[["Category","Product","Price PHP","Price type","Reference URL"]];CAT.forEach(c=>{const p=selected(c.key);lines.push([c.title,p.name,p.price,priceTag(p),p.url])});lines.push(["TOTAL","",CAT.reduce((n,c)=>n+selected(c.key).price,0),"Planning estimate",""]);const csv=lines.map(a=>a.map(x=>'"'+String(x).replace(/"/g,'""')+'"').join(",")).join("\r\n");const blob=new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="UnitLab3D_PC_Build_Snapshot.csv";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function renderSafety(){$("#toolsGrid").innerHTML=TOOLS.map(p=>'<article class="tool-card"><div class="tool-symbol">'+p[0]+'</div><h3>'+esc(p[1])+'</h3><p>'+esc(p[2])+'</p><small>'+esc(p[3])+'</small></article>').join("");$("#ppeGrid").innerHTML=PPE.map(p=>'<article class="tool-card"><div class="tool-symbol">'+p[0]+'</div><h3>'+esc(p[1])+'</h3><p>'+esc(p[2])+'</p><small>'+esc(p[3])+'</small></article>').join("");renderChecklist()}
function renderChecklist(){const key="unitlab3d_safety_check_"+(state.student||"guest");let old=[];try{old=JSON.parse(sessionStorage.getItem(key))||[]}catch{}$("#checklist").innerHTML=CHECKS.map((t,i)=>'<label><input type="checkbox" data-check="'+i+'" '+(old.includes(i)?"checked":"")+'><span>'+esc(t)+'</span></label>').join("")+'<p class="completion" id="checkProgress">'+old.length+' / '+CHECKS.length+' complete · This checklist is for learning, not a substitute for teacher inspection.</p>';$$("[data-check]").forEach(c=>c.addEventListener("change",()=>{let indices=$$("[data-check]").filter(x=>x.checked).map(x=>Number(x.dataset.check));sessionStorage.setItem(key,JSON.stringify(indices));$("#checkProgress").textContent=indices.length+" / "+CHECKS.length+" complete · "+(indices.length===CHECKS.length?"Discuss readiness with your instructor.":"Continue checking procedures.")}))}
function startQuiz(){state.quiz=0;state.correct=0;state.answer=null;state.completed=true;renderQuiz()}
function renderQuiz(){const root=$("#quizContent"),saved=getProgress();if(!state.completed){root.innerHTML='<div class="eyebrow">8 QUESTIONS · FORMATIVE PRACTICE</div><h2>Ready to test your knowledge?</h2><p>Review hardware and safety concepts. Learners can repeat the quiz. Best score is saved only after a demo sign-in.</p><p>Best local score: <b>'+((saved.best===null||saved.best===undefined)?"Not yet recorded":saved.best+" / 8")+'</b></p><button class="btn solid" id="startKnowledge">Start knowledge check →</button>';$("#startKnowledge").addEventListener("click",startQuiz);return}if(state.quiz>=QUIZ.length){const best=Math.max(getProgress().best||0,state.correct);if(state.student){let p=getProgress();p.best=best;setProgress(p)}root.innerHTML='<div class="eyebrow">KNOWLEDGE CHECK COMPLETE</div><h2>'+state.correct+' / '+QUIZ.length+' correct</h2><p>This score is a practice indicator only. It cannot determine practical performance improvement or research significance.</p><div class="paper-actions"><button class="btn solid" id="quizAgain">Try again</button><button class="btn outline" id="quizToModules">Review modules</button></div>';$("#quizAgain").addEventListener("click",startQuiz);$("#quizToModules").addEventListener("click",()=>navigate("modules"));return}const q=QUIZ[state.quiz];root.innerHTML='<div class="eyebrow">QUESTION '+(state.quiz+1)+' OF '+QUIZ.length+' · '+state.correct+' CORRECT</div><h2>'+esc(q.q)+'</h2>'+q.choices.map((a,i)=>'<button class="answer-button" data-answer="'+i+'" '+(state.answer!==null?"disabled":"")+'>'+String.fromCharCode(65+i)+' · '+esc(a)+'</button>').join("")+'<div id="feedbackArea"></div><div id="nextArea"></div>';$$("[data-answer]").forEach(b=>b.addEventListener("click",()=>{if(state.answer!==null)return;const n=Number(b.dataset.answer);state.answer=n;if(n===q.ok)state.correct++;$$("[data-answer]").forEach(el=>{el.disabled=true;if(Number(el.dataset.answer)===q.ok)el.classList.add("right");else if(Number(el.dataset.answer)===n)el.classList.add("wrong")});$("#feedbackArea").innerHTML='<div class="feedback"><b>'+(n===q.ok?"Correct!":"Not quite.")+'</b><p>'+esc(q.why)+'</p></div>';$("#nextArea").innerHTML='<button class="btn solid" id="nextQuestion">'+(state.quiz===QUIZ.length-1?"See results":"Next question")+' →</button>';$("#nextQuestion").addEventListener("click",()=>{state.quiz++;state.answer=null;renderQuiz()})}))}
function heroPC(){$("#heroPc").innerHTML='<div class="case-model" style="transform:perspective(800px) rotateY(-14deg) rotateX(5deg) scale(1.03)"><div class="case-top-led"></div><div class="case-glass"><div class="motherboard-visual"><div class="mb-label">UNITLAB / PC ENGINE</div><div class="cpu-visual">CPU</div><div class="ram-visual"><i></i><i></i></div><div class="gpu-visual">GRAPHICS</div><div class="storage-visual"></div></div><div class="fan-visual"><i></i><i></i></div><div class="psu-visual">PSU 650W</div></div></div>'}
function initialize(){heroPC();const searchInput=$("#resourceSearch");if(searchInput)searchInput.addEventListener("input",renderResources);renderResources();renderModules();renderPlans();renderBuilder();renderSafety();renderQuiz();authUI();$$("[data-go]").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.go)));window.addEventListener("hashchange",()=>{const p=location.hash.slice(1);if($("#view-"+p)&&p!==state.page)navigate(p)});$("#loginTop").addEventListener("click",showLogin);$("#loginSidebar").addEventListener("click",()=>state.student?logout():showLogin());$("#logoutTop").addEventListener("click",logout);$("#loginForm").addEventListener("submit",login);$("#modalClose").addEventListener("click",closeLogin);$("#authModal").addEventListener("click",e=>{if(e.target.id==="authModal")closeLogin()});$("#menuToggle").addEventListener("click",toggleRail);$("#railScrim").addEventListener("click",closeRail);document.addEventListener("keydown",e=>{if(e.key==="Escape")closeRail()});$("#resetBuild").addEventListener("click",()=>{build={...defaults,cpu:"r5600",board:"b550",ram:"ddr4_16",gpu:"rtx4060",storage:"sn580_500",psu:"cx650",case:"mcase",cooler:"stock"};renderBuilder();toast("PC build reset")});$("#saveBuild").addEventListener("click",saveBuild);$("#exportBuild").addEventListener("click",downloadBuild);const saved=getProgress();if(saved.build&&Object.keys(defaults).every(k=>findProduct(k,saved.build[k])))build={...saved.build};renderBuilder();const requestedModule=new URLSearchParams(location.search).get("module");if(requestedModule!==null&&/^[0-5]$/.test(requestedModule))state.module=Number(requestedModule);const route=location.hash.slice(1);navigate($("#view-"+route)?(route==="home"?"home":route):"modules")}
/* Keep the 3D workbench in the same page scroll, without an inner scrollbar.
   Only accept height events from our own same-origin iframe. */
window.addEventListener("message",event=>{
  const frame=$("#labFrame");
  if(!frame||event.origin!==location.origin||event.source!==frame.contentWindow)return;
  const payload=event.data;
  if(!payload||payload.type!=="unitlab3d:workbench-height")return;
  const h=Number(payload.height);
  if(!Number.isFinite(h)||h<300||h>12000)return;
  frame.style.height=Math.ceil(h)+"px";
});
document.addEventListener("DOMContentLoaded",initialize);
