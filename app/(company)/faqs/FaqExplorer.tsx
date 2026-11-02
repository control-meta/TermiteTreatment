'use client';

import { useState } from 'react';
import { ArrowUpRight, ChevronDown, Search, X } from 'lucide-react';
import { faqs, faqTopics, type FaqTopic } from '../../../lib/faqs';
import styles from './faqs.module.css';

export default function FaqExplorer() {
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState<FaqTopic | 'all'>('all');
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const matches = faqs.filter(faq => (topic === 'all' || faq.topic === topic) && words.every(word => `${faq.question} ${faq.answer}`.toLowerCase().includes(word)));
  const reset = () => { setQuery(''); setTopic('all'); };

  return <section id="answers" className={styles.explorer} aria-labelledby="answers-title">
    <aside className={styles.topics}><p>Browse by topic</p><nav aria-label="FAQ topics">
      <button type="button" aria-pressed={topic === 'all'} onClick={() => setTopic('all')}>All questions <span>{faqs.length}</span></button>
      {faqTopics.map(item => <button key={item.id} type="button" aria-pressed={topic === item.id} onClick={() => setTopic(item.id)}>{item.title}<span>5</span></button>)}
    </nav><a href="/contact-us#enquiry">Prefer to talk?<br /><strong>Ask our team <ArrowUpRight size={16} aria-hidden="true" /></strong></a></aside>
    <div className={styles.answers}>
      <div className={styles.search}><Search size={20} aria-hidden="true" /><label className={styles.srOnly} htmlFor="faq-search">Search questions and answers</label><input id="faq-search" type="search" placeholder="Search a question, e.g. warranty" value={query} onChange={event => setQuery(event.target.value)} autoComplete="off" />{query && <button type="button" onClick={() => setQuery('')} aria-label="Clear search"><X size={17} /></button>}</div>
      <div className={styles.resultHeading}><h2 id="answers-title">{topic === 'all' ? 'A little clarity goes a long way.' : faqTopics.find(item => item.id === topic)?.title}</h2><p role="status" aria-live="polite">{matches.length} {matches.length === 1 ? 'answer' : 'answers'}{query && ' found'}</p></div>
      {faqTopics.map(group => { const items = matches.filter(item => item.topic === group.id); if (!items.length) return null; return <section className={styles.questionGroup} key={group.id} aria-labelledby={`topic-${group.id}`}><div className={styles.groupHeading}><span aria-hidden="true">0{faqTopics.indexOf(group) + 1}</span><div><h3 id={`topic-${group.id}`}>{group.title}</h3><p>{group.description}</p></div></div><div className={styles.questionList}>{items.map(faq => <details key={faq.id} id={faq.id} name="termite-help-faq"><summary>{faq.question}<span><ChevronDown size={18} aria-hidden="true" /></span></summary><p>{faq.answer}</p></details>)}</div></section>; })}
      {!matches.length && <div className={styles.empty}><Search size={28} aria-hidden="true" /><h3>No matching answers yet.</h3><p>Try a shorter search or explore another topic. Our team can help with a question specific to your property.</p><button type="button" onClick={reset}>Show all 30 questions</button></div>}
    </div>
  </section>;
}
