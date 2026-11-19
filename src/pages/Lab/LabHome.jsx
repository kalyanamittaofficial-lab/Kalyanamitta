import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getRoadmapItems, getAnnotationSummary } from '../../services/studyRoadmapStore';
import { getAllReadingProgress } from '../../services/readingProgressStore';
import { getMapNodes } from '../../services/knowledgeMapStore';
import { getPathReflections, getPinPothaEntries } from '../../services/practiceEcosystemStore';

export default function LabHome() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState(() => getRoadmapItems());
  const [progress, setProgress] = useState(() => getAllReadingProgress());
  const [mapNodes, setMapNodes] = useState(() => getMapNodes());
  const [reflections, setReflections] = useState(() => getPathReflections());
  const [pinEntries, setPinEntries] = useState(() => getPinPothaEntries());

  useEffect(() => {
    const refreshNotes = () => setNotes(getRoadmapItems());
    const refreshProgress = () => setProgress(getAllReadingProgress());
    const refreshMap = () => setMapNodes(getMapNodes());
    const refreshPractice = () => {
      setReflections(getPathReflections());
      setPinEntries(getPinPothaEntries());
    };

    window.addEventListener('studyRoadmapUpdated', refreshNotes);
    window.addEventListener('labReadingProgressUpdated', refreshProgress);
    window.addEventListener('labKnowledgeMapUpdated', refreshMap);
    window.addEventListener('labPracticeUpdated', refreshPractice);
    return () => {
      window.removeEventListener('studyRoadmapUpdated', refreshNotes);
      window.removeEventListener('labReadingProgressUpdated', refreshProgress);
      window.removeEventListener('labKnowledgeMapUpdated', refreshMap);
      window.removeEventListener('labPracticeUpdated', refreshPractice);
    };
  }, []);

  const latestSutta = progress[0] || {
    suttaKey: 'sn-5-12-2-1',
    suttaTitleSinhala: 'ධම්මචක්කප්පවත්තන සූත්‍රය',
    suttaTitlePali: 'Dhammacakkappavattana Sutta'
  };
  const latestReflection = reflections[0];
  const latestPin = pinEntries[0];

  return (
    <div className="km-lab-page">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '18px', alignItems: 'start' }}>
        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Continue Reading */}
          <div className="km-lab-card" style={{ padding: '20px 22px', border: '1.5px solid var(--lab-text)' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--lab-text-muted)', marginBottom: '6px' }}>
              කියවීම ඉදිරියට
            </div>
            <div style={{ fontSize: '1.22rem', fontWeight: '700', color: 'var(--lab-text)', marginBottom: '4px' }}>
              {latestSutta.suttaTitleSinhala || latestSutta.suttaTitlePali}
            </div>
            <div style={{ fontSize: '0.86rem', color: 'var(--lab-text-muted)', marginBottom: '16px' }}>
              {latestSutta.suttaTitlePali} · පාලි සහ සිංහල සමපාත කියවීම
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--lab-text-muted)' }}>
                {latestSutta.lastSegmentId ? `ස්ථානය: ${latestSutta.lastSegmentId}` : 'බුද්ධ ජයන්ති ත්‍රිපිටකය'}
              </span>
              <button
                onClick={() => navigate(`/lab/sutta/${latestSutta.suttaKey}`)}
                className="km-lab-btn-primary"
              >
                <span>කියවීම අරඹන්න</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* My Current Path */}
          <div className="km-lab-card" style={{ padding: '20px 22px' }}>
            <div style={{ fontWeight: '700', fontSize: '0.96rem', marginBottom: '12px' }}>
              මගේ වත්මන් මාර්ගය
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '14px' }}>
              <div>
                <div style={{ fontSize: '0.84rem', fontWeight: '700', marginBottom: '2px' }}>
                  වත්මන් විමසුම
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--lab-text-muted)' }}>
                  {latestReflection?.intention || 'සූත්‍ර අවබෝධය එදිනෙදා ජීවිතයට සම්බන්ධ කරගන්නේ කෙසේද?'}
                </div>
              </div>
              <Link to="/lab/map" style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--lab-text)', whiteSpace: 'nowrap' }}>
                විවෘත කරන්න →
              </Link>
            </div>
            <div style={{
              padding: '14px 12px',
              borderRadius: '8px',
              border: '1px dashed var(--lab-border)',
              background: 'var(--lab-bg-subtle)',
              textAlign: 'center',
              fontSize: '0.78rem',
              color: 'var(--lab-text-muted)'
            }}>
              නිවන (අරමුණ) → වත්මන් විමසුම → සූත්‍ර අවබෝධය → පටිපදා → නිරීක්ෂණය
            </div>
          </div>

          {/* Recent Notes */}
          <div className="km-lab-card" style={{ padding: '20px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontWeight: '700', fontSize: '0.96rem' }}>
                මෑත සටහන්
              </div>
              <Link to="/lab/roadmap" style={{ fontSize: '0.8rem', color: 'var(--lab-text-muted)', textDecoration: 'none', fontWeight: '600' }}>
                සියල්ල →
              </Link>
            </div>

            {notes.length === 0 ? (
              <p style={{ fontSize: '0.84rem', color: 'var(--lab-text-muted)', margin: 0 }}>
                තවමත් සටහන් නොමැත. සූත්‍ර කියවනයෙන් සටහනක් එක් කරන්න.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {notes.slice(0, 2).map((item, idx) => {
                  const summary = getAnnotationSummary(item);
                  return (
                    <div
                      key={item.id}
                      style={{
                        paddingTop: idx > 0 ? '12px' : 0,
                        borderTop: idx > 0 ? '1px solid var(--lab-border)' : 'none'
                      }}
                    >
                      <div style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '2px' }}>
                        {summary?.title || item.target?.suttaTitleSinhala || item.target?.source}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--lab-text-muted)', marginBottom: '10px' }}>
                        {item.target?.suttaTitleSinhala || item.target?.suttaTitlePali || item.target?.source}
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button onClick={() => navigate(`/lab/sutta/${item.target?.source}`)} className="km-lab-btn" style={{ padding: '5px 11px', fontSize: '0.78rem' }}>
                          කියවනයේ විවෘත කරන්න
                        </button>
                        <button onClick={() => navigate('/lab/map')} className="km-lab-btn" style={{ padding: '5px 11px', fontSize: '0.78rem' }}>
                          සම්බන්ධතා බලන්න
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* 3 Compact Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            <div className="km-lab-card" style={{ padding: '14px 16px' }}>
              <div style={{ fontSize: '1.35rem', fontWeight: '700', marginBottom: '2px' }}>{notes.length}</div>
              <div style={{ fontSize: '0.76rem', color: 'var(--lab-text-muted)' }}>සටහන්</div>
            </div>
            <div className="km-lab-card" style={{ padding: '14px 16px' }}>
              <div style={{ fontSize: '1.35rem', fontWeight: '700', marginBottom: '2px' }}>{pinEntries.length}</div>
              <div style={{ fontSize: '0.76rem', color: 'var(--lab-text-muted)' }}>පින් පොත</div>
            </div>
            <div className="km-lab-card" style={{ padding: '14px 16px' }}>
              <div style={{ fontSize: '1.35rem', fontWeight: '700', marginBottom: '2px' }}>{mapNodes.length}</div>
              <div style={{ fontSize: '0.76rem', color: 'var(--lab-text-muted)' }}>සිතියම් අංග</div>
            </div>
          </div>

          {/* Pin Potha */}
          <div className="km-lab-card" style={{ padding: '20px 22px' }}>
            <div style={{ fontWeight: '700', fontSize: '0.96rem', marginBottom: '4px' }}>
              පින් පොත (පුඤ්ඤ පොත්ථක)
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--lab-text-muted)', margin: '0 0 12px 0' }}>
              දාන, සීල, භාවනා, පටිපදා, පුරුදු සහ පුණ්‍යානුමෝදනා.
            </p>
            <div style={{ paddingTop: '10px', borderTop: '1px solid var(--lab-border)', marginBottom: '12px' }}>
              <div style={{ fontWeight: '700', fontSize: '0.88rem' }}>
                {latestPin?.title || 'පළමු කුසල සටහන එක් කරන්න'}
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--lab-text-muted)' }}>
                {latestPin ? 'පෞද්ගලික සටහන' : 'පෞද්ගලිකයි'}
              </div>
            </div>
            <button onClick={() => navigate('/lab/pin-potha')} className="km-lab-btn-primary">
              පින් පොත විවෘත කරන්න
            </button>
          </div>

          {/* My Knowledge Map */}
          <div className="km-lab-card" style={{ padding: '20px 22px' }}>
            <div style={{ fontWeight: '700', fontSize: '0.96rem', marginBottom: '12px' }}>
              මගේ ධර්ම සිතියම
            </div>
            <div style={{
              padding: '22px 14px',
              borderRadius: '8px',
              border: '1px dashed var(--lab-border)',
              background: 'var(--lab-bg-subtle)',
              textAlign: 'center',
              fontSize: '0.78rem',
              color: 'var(--lab-text-muted)',
              marginBottom: '12px'
            }}>
              සූත්‍ර ◇ සටහන් ◇ පටිපදා ◇ පින් පොත ({mapNodes.length} අංග)
            </div>
            <button onClick={() => navigate('/lab/map')} className="km-lab-btn">
              සම්බන්ධතා ගවේෂණය කරන්න
            </button>
          </div>

          {/* Community Discovery */}
          <div className="km-lab-card" style={{ padding: '20px 22px' }}>
            <div style={{ fontWeight: '700', fontSize: '0.96rem', marginBottom: '4px' }}>
              ප්‍රජා ගවේෂණය
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--lab-text-muted)', margin: '0 0 12px 0' }}>
              මූලාශ්‍ර හා කර්තෘත්වය සහිතව බෙදාගත් පොදු ධර්ම සිතියම්.
            </p>
            <button onClick={() => navigate('/lab/explore')} className="km-lab-btn">
              පොදු සිතියම් බලන්න
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
