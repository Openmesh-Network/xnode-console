import IndividualModules from './docs-components/individualModules'

export default function Tasks() {
  const modulesData = [
    {
      title: 'Dashboard',
      strongTitle: 'Understanding Xnode',
      subTitle: 'Setting Up',
      listItem: [
        {
          title: 'Step-by-step guide xNode.',
          href: 'https://docs.openmesh.network/products/xnode',
        },
        {
          title: 'Step-by-step guide to deploying an xNode',
          href: 'https://docs.openmesh.network/products/xnode',
        },
        {
          title:
            "An introduction to xNode's role in decentralizing data infrastructure.",
          href: 'https://docs.openmesh.network/products/xnode',
        },
      ],
      icon: '/images/lateralNavBar/cubo.svg',
    },
    {
      title: 'Servers',
      strongTitle: 'Understanding Xnode',
      subTitle: 'Setting Up',
      listItem: [
        {
          title: 'Step-by-step guide xNode.',
          href: 'https://docs.openmesh.network/products/xnode',
        },
        {
          title: 'Step-by-step guide to deploying an xNode',
          href: 'https://docs.openmesh.network/products/xnode',
        },
        {
          title:
            "An introduction to xNode's role in decentralizing data infrastructure.",
          href: 'https://docs.openmesh.network/products/xnode',
        },
      ],
      icon: '/images/lateralNavBar/server.svg',
    },
    {
      title: 'Data',
      strongTitle: 'Understanding Xnode',
      subTitle: 'Setting Up',
      listItem: [
        {
          title: 'Step-by-step guide xNode.',
          href: 'https://docs.openmesh.network/products/xnode',
        },
        {
          title: 'Step-by-step guide to deploying an xNode',
          href: 'https://docs.openmesh.network/products/xnode',
        },
        {
          title:
            "An introduction to xNode's role in decentralizing data infrastructure.",
          href: 'https://docs.openmesh.network/products/xnode',
        },
      ],
      icon: '/images/lateralNavBar/database.svg',
    },
    {
      title: 'RPC',
      strongTitle: 'Understanding Xnode',
      subTitle: 'Setting Up',
      listItem: [
        {
          title: 'Step-by-step guide xNode.',
          href: 'https://docs.openmesh.network/products/xnode',
        },
        {
          title: 'Step-by-step guide to deploying an xNode',
          href: 'https://docs.openmesh.network/products/xnode',
        },
        {
          title:
            "An introduction to xNode's role in decentralizing data infrastructure.",
          href: 'https://docs.openmesh.network/products/xnode',
        },
      ],
      icon: '/images/lateralNavBar/node.svg',
    },
    {
      title: 'Analytics',
      strongTitle: 'Understanding Xnode',
      subTitle: 'Setting Up',
      listItem: [
        {
          title: 'Step-by-step guide xNode.',
          href: 'https://docs.openmesh.network/products/xnode',
        },
        {
          title: 'Step-by-step guide to deploying an xNode',
          href: 'https://docs.openmesh.network/products/xnode',
        },
        {
          title:
            "An introduction to xNode's role in decentralizing data infrastructure.",
          href: 'https://docs.openmesh.network/products/xnode',
        },
      ],
      icon: '/images/lateralNavBar/bolas.svg',
    },
    {
      title: 'ML/LLMs',
      strongTitle: 'Understanding Xnode',
      subTitle: 'Setting Up',
      listItem: [
        {
          title: 'Step-by-step guide xNode.',
          href: 'https://docs.openmesh.network/products/xnode',
        },
        {
          title: 'Step-by-step guide to deploying an xNode',
          href: 'https://docs.openmesh.network/products/xnode',
        },
        {
          title:
            "An introduction to xNode's role in decentralizing data infrastructure.",
          href: 'https://docs.openmesh.network/products/xnode',
        },
      ],
      icon: '/images/lateralNavBar/ml.svg',
    },
  ]
  return (
    <>
      <div className="ml-[8px] flex w-full flex-col items-start rounded-[10px] pb-[172px] pl-[85px] pr-[132px] pt-[45px] md:pb-[213px] md:pl-[102px] md:pr-[158px] md:pt-[54px] lg:pb-[248px] lg:pl-[119px] lg:pr-[184px] lg:pt-[63px] xl:pb-[284px] xl:pl-[136px] xl:pr-[211px] xl:pt-[72px] 2xl:pb-[355px] 2xl:pl-[170px] 2xl:pr-[264px] 2xl:pt-[90px]">
        <h1 className="font-inter mt-[-5px] flex h-[56px] w-[1067px] flex-row justify-start text-[40px] font-normal text-black">
          Basics
        </h1>
        <div className="flex h-[312px] w-[928px] flex-col items-start text-[#0354EC]">
          <hr className="ml-[5px] mt-[40px] w-[220px] border-[0.5px] border-[#D9D9D9]"></hr>
          <a
            className="font-inter ml-[5px] mt-[17px] text-[16px] font-bold leading-[18px]"
            target="_blank"
            rel="noopener noreferrer"
            href="https://docs.openmesh.network/products/xnode"
          >
            Understanding Xnode
          </a>
          <a
            href="https://docs.openmesh.network/products/xnode"
            target="_blank"
            rel="noopener noreferrer"
            className="font-inter ml-[5px] mt-[4px] text-justify text-[14px] font-medium leading-[24px]"
          >
            An introduction to xNode&apos;s role in decentralizing data
            infrastructure.
          </a>

          <a
            className="font-inter ml-[5px] mt-[50px] text-[16px] font-bold leading-[18px]"
            target="_blank"
            rel="noopener noreferrer"
            href="https://docs.openmesh.network/products/xnode"
          >
            Setting Up
          </a>
          <a
            href="https://docs.openmesh.network/products/xnode"
            target="_blank"
            rel="noopener noreferrer"
            className="font-inter ml-[5px] mt-px text-justify text-[14px] font-medium leading-[24px]"
          >
            Step-by-step guide to deploying an xNode.
          </a>
          <a
            href="https://docs.openmesh.network/products/xnode"
            target="_blank"
            rel="noopener noreferrer"
            className="font-inter ml-[5px] mt-px text-justify text-[14px] font-medium leading-[24px]"
          >
            Technical design
          </a>
          <a
            href="https://docs.openmesh.network/products/xnode"
            target="_blank"
            rel="noopener noreferrer"
            className="font-inter ml-[5px] mt-[22px] text-justify text-[14px] font-medium leading-[24px]"
          >
            Developer support and resources
          </a>
          <a
            href="https://docs.openmesh.network/products/xnode"
            target="_blank"
            rel="noopener noreferrer"
            className="font-inter ml-[5px] mt-px text-justify text-[14px] font-medium leading-[24px]"
          >
            Docs & Research
          </a>
        </div>
        <h1 className="font-inter mt-[120px] flex h-[56px] w-[1067px] flex-row justify-start text-[40px] font-normal text-black">
          Get to know individual modules
        </h1>
        <div className="lg:w-70 min-[1536]:grid-cols-1 grid grid-cols-1 items-center justify-between gap-x-[115px] gap-y-[100px] sm:grid-cols-2 xl:w-80 2xl:w-full">
          <IndividualModules {...modulesData[0]} />
          <IndividualModules {...modulesData[1]} />
          <IndividualModules {...modulesData[2]} />
          <IndividualModules {...modulesData[3]} />
          <IndividualModules {...modulesData[4]} />
          <IndividualModules {...modulesData[5]} />
        </div>
      </div>
    </>
  )
}
