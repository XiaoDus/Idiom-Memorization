import { Idiom } from '../types';

interface FlashCardProps {
  idiom: Idiom;
  isFlipped: boolean;
  onFlip: () => void;
}

export default function FlashCard({ idiom, isFlipped, onFlip }: FlashCardProps) {
  return (
    <div className="perspective-1000 w-full max-w-2xl mx-auto">
      <div
        className={`relative w-full h-96 cursor-pointer preserve-3d transition-transform duration-700 ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onClick={!isFlipped ? onFlip : undefined}
      >
        <div className="absolute inset-0 backface-hidden">
          <div className="w-full h-full bg-white rounded-2xl shadow-2xl flex flex-col items-center justify-center p-8 border-4 border-zhuhong/20">
            <div className="text-sm text-zhuhong mb-4">点击显示释义</div>
            <h3 className="text-5xl font-bold font-song text-zhuise text-center">
              {idiom.idiom}
            </h3>
            <div className="mt-6 text-6xl animate-bounce">👆</div>
          </div>
        </div>

        <div className="absolute inset-0 backface-hidden rotate-y-180">
          <div className="w-full h-full bg-gradient-to-br from-zhuhong to-red-700 rounded-2xl shadow-2xl p-8 text-white overflow-y-auto">
            <h3 className="text-4xl font-bold font-song text-center mb-6">
              {idiom.idiom}
            </h3>
            
            <div className="bg-white/20 rounded-xl p-4 mb-6">
              <h4 className="text-lg font-semibold mb-2">释义</h4>
              <p className="leading-relaxed">{idiom.meaning}</p>
            </div>

            <div className="space-y-3">
              <h4 className="text-lg font-semibold">例句</h4>
              {idiom.examples.map((example, idx) => (
                <p key={idx} className="text-sm bg-white/10 p-3 rounded-lg leading-relaxed">
                  {example}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
