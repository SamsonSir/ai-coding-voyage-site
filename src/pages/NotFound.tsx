import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-read flex-col items-center px-5 py-24 text-center">
      <img src="/empty-treasure.svg" alt="空宝箱" className="h-36 w-auto" />
      <h1 className="mt-6 font-serif text-3xl font-bold text-ink">404 · 偏离航线了</h1>
      <p className="mt-3 text-sm text-ink-soft">这片海域尚未被标注在地图上。</p>
      <Link
        to="/"
        className="mt-8 rounded-full bg-vermilion px-6 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-px hover:bg-vermilion-soft"
      >
        返回首页 →
      </Link>
    </div>
  );
}
