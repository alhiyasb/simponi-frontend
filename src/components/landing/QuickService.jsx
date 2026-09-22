const services = [
  {
    number: "01",
    title: "Pelaporan Kasus",
    description:
      "Masyarakat dapat menyampaikan laporan secara aman melalui sistem digital SIMPONI.",
    icon: "↗",
  },
  {
    number: "02",
    title: "Tracking Laporan",
    description:
      "Pantau perkembangan laporan secara transparan menggunakan sistem monitoring.",
    icon: "⌁",
  },
  {
    number: "03",
    title: "Pendampingan",
    description:
      "Dapatkan informasi dan layanan pendampingan dari pihak terkait.",
    icon: "＋",
  },
];


export default function ServiceSection(){

return (

<section className="
py-24
bg-white
">


<div className="
max-w-[1280px]
mx-auto
px-8
">


<div className="
text-center
mb-14
">


<p className="
text-sm
font-semibold
tracking-[0.25em]
text-blue-600
uppercase
">

What We Do

</p>


<h2 className="
mt-4
text-4xl
font-bold
text-slate-900
">

Layanan SIMPONI

</h2>


<p className="
mt-4
text-slate-500
max-w-xl
mx-auto
">

Layanan digital untuk mendukung pelaporan,
pemantauan, dan pendampingan masyarakat.

</p>


</div>





<div className="
grid
md:grid-cols-3
gap-8
">


{
services.map((item,index)=>(


<div

key={index}

className="
group
relative
rounded-[30px]
border
border-slate-200
p-8
bg-white
hover:-translate-y-2
hover:shadow-xl
transition-all
duration-300
"


>


<div className="
flex
justify-between
items-start
">


<span className="
text-sm
font-bold
text-blue-600
">

{item.number}

</span>


<div className="
w-12
h-12
rounded-full
bg-blue-50
flex
items-center
justify-center
text-blue-600
text-xl
group-hover:bg-blue-600
group-hover:text-white
transition
">

{item.icon}

</div>


</div>




<h3 className="
mt-10
text-2xl
font-bold
text-slate-900
">

{item.title}

</h3>



<p className="
mt-4
text-slate-500
leading-relaxed
">

{item.description}

</p>




<button className="
mt-8
text-blue-600
font-semibold
text-sm
">

Pelajari →
</button>


</div>


))

}


</div>


</div>


</section>

)

}