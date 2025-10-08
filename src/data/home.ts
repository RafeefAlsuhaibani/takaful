export type Stat = { 
  label: string; 
  value: string; 
};

export type Service = { 
  id: string; 
  title: string; 
  desc: string; 
  ctaLabel: string; 
  href: string; 
};

export const mockStats: Stat[] = [
  { label: "مستفيد", value: "+ 67,000" },
  { label: "مشروع محتمل", value: "+ 2,150" },
  { label: "متبرع", value: "+ 15,000" }
];

export const mockServices: Service[] = [
  { 
    id: "saqya", 
    title: "مشروع السقيا", 
    desc: "توفير المياه النقية للمحتاجين عبر حفر الآبار وتركيب أنظمة الماء.", 
    ctaLabel: "طلب سقيا الماء", 
    href: "/services/saqya" 
  },
  { 
    id: "balsam", 
    title: "مشروع بلسم", 
    desc: "توريد الأجهزة الطبية للمحتاجين بالتبرع أو الإيجار بأسعار رمزية.", 
    ctaLabel: "طلب جهاز طبي", 
    href: "/services/balsam" 
  },
  { 
    id: "transport", 
    title: "النقل الطبي", 
    desc: "نقل المرضى للمستشفيات والمراكز الطبية بمركبات مجهزة.", 
    ctaLabel: "طلب خدمة النقل الطبي", 
    href: "/services/transport" 
  },
  { 
    id: "volunteer", 
    title: "التطوع", 
    desc: "إدارة وتنظيم الأنشطة التطوعية في مجالات مختلفة.", 
    ctaLabel: "قدّم على التطوع", 
    href: "/volunteer" 
  }
];
