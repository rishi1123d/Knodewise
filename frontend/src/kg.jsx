import React from 'react';
import './kg.css';

const KnowledgeTree = () => {
  return (
    <div className="knowledge-tree-container">
      {/* Root Node - AP Calculus BC */}
      <div className="node root-node">
        <div className="node-content">
          <h2>AP Calculus BC</h2>
          <div className="understanding-level">
            <span>Understanding Level: 85%</span>
          </div>
        </div>

        {/* Main Branches */}
        <div className="branches">
          {/* Limits & Continuity Branch */}
          <div className="branch limits-branch">
            <div className="node topic-node limits-topic">
              <div className="node-content">
                <h3>Limits & Continuity</h3>
                <div className="progress-pill green">
                  <span>88%</span>
                </div>
              </div>
              
              {/* Sub-branches for Limits & Continuity */}
              <div className="sub-branches limits-sub">
                <div className="sub-branch limits-at-point-branch">
                  <div className="node subtopic-node limits-at-point">
                    <div className="node-content">
                      <h4>Limits at a point</h4>
                      <div className="progress-pill green">
                        <span>95%</span>
                      </div>
                    </div>
                    
                    {/* Concepts under Limits at a point */}
                    <div className="concept-branches">
                      <div className="concept-node one-sided">
                        <span>One-sided limits</span>
                        <span className="score">4/5</span>
                      </div>
                      <div className="concept-node infinite-limits">
                        <span>Infinite Limits</span>
                        <span className="score">6/7</span>
                      </div>
                      <div className="concept-node limits-infinity">
                        <span>Limits at infinity</span>
                        <span className="score">5/5</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="sub-branch continuity-branch">
                  <div className="node subtopic-node continuity">
                    <div className="node-content">
                      <h4>Continuity</h4>
                      <div className="progress-pill yellow">
                        <span>66%</span>
                      </div>
                    </div>
                    
                    {/* Concepts under Continuity */}
                    <div className="concept-branches">
                      <div className="concept-node removable">
                        <span>Removable</span>
                        <span className="score">3/6</span>
                      </div>
                      <div className="concept-node jump">
                        <span>Jump</span>
                        <span className="score">4/6</span>
                      </div>
                      <div className="concept-node infinite">
                        <span>Infinite</span>
                        <span className="score">5/6</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Derivatives Branch */}
          <div className="branch derivatives-branch">
            <div className="node topic-node derivatives-topic">
              <div className="node-content">
                <h3>Derivatives</h3>
                <div className="progress-pill green">
                  <span>93%</span>
                </div>
              </div>
              
              {/* Sub-branches for Derivatives */}
              <div className="sub-branches derivatives-sub">
                <div className="sub-branch derivative-rules-branch">
                  <div className="node subtopic-node derivative-rules">
                    <div className="node-content">
                      <h4>Derivative Rules</h4>
                      <div className="progress-pill red">
                        <span>35%</span>
                      </div>
                    </div>
                    
                    {/* Concepts under Derivative Rules */}
                    <div className="concept-branches">
                      <div className="concept-node power-rule">
                        <span>Power Rule</span>
                        <span className="score">1/3</span>
                      </div>
                      <div className="concept-node product-rule">
                        <span>Product Rule</span>
                        <span className="score">1/3</span>
                      </div>
                      <div className="concept-node chain-rule">
                        <span>Chain Rule</span>
                        <span className="score">1/3</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Integration Techniques (Locked) */}
          <div className="branch integration-branch">
            <div className="node locked-node">
              <div className="node-content">
                <h3>Integration Techniques</h3>
                <div className="lock-icon">
                  <i className="fa fa-lock"></i>
                </div>
              </div>
            </div>
          </div>
          
          {/* Differential Equations (Locked) */}
          <div className="branch differential-branch">
            <div className="node locked-node">
              <div className="node-content">
                <h3>Differential Equations</h3>
                <div className="lock-icon">
                  <i className="fa fa-lock"></i>
                </div>
              </div>
            </div>
          </div>
          
          {/* Series (Locked) */}
          <div className="branch series-branch">
            <div className="node locked-node">
              <div className="node-content">
                <h3>Series</h3>
                <div className="lock-icon">
                  <i className="fa fa-lock"></i>
                </div>
              </div>
            </div>
          </div>
          
          {/* Integrals (Locked) */}
          <div className="branch integrals-branch">
            <div className="node locked-node">
              <div className="node-content">
                <h3>Integrals</h3>
                <div className="lock-icon">
                  <i className="fa fa-lock"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeTree;