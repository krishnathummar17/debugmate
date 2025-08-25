import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Badge, ProgressBar, Alert } from 'react-bootstrap';
import { FiMoreHorizontal, FiFilter, FiHeart, FiPlus, FiCalendar, FiUsers, FiClock, FiUser, FiCode, FiFileText, FiRefreshCw, FiArrowUp } from 'react-icons/fi';
import './Dashboard.css';
import { Link, useLocation } from 'react-router-dom';
import projectDatabaseSupabase from '../../services/projectDatabaseSupabase';

const StatCard = ({ value, title, icon }) => (
  <div className="stat-card-custom d-flex flex-column align-items-center justify-content-center">
    {icon && <div className="mb-2">{icon}</div>}
    <div className="stat-value">{value}</div>
    <div className="stat-title">{title}</div>
  </div>
);

const ProjectCard = ({ project }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'success';
      case 'in progress': return 'primary';
      case 'on hold': return 'warning';
      case 'not started': return 'secondary';
      default: return 'info';
    }
  };

  const getProgressValue = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 100;
      case 'in progress': return 60;
      case 'on hold': return 30;
      case 'not started': return 0;
      default: return 0;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: '2-digit', 
      year: 'numeric' 
    });
  };

  const calculateDaysLeft = (endDate) => {
    if (!endDate) return 'No deadline';
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    return `${diffDays} days left`;
  };

  // Handle both database field names and form field names
  const projectName = project.project_name || project.projectName || 'Untitled Project';
  const projectDescription = project.project_description || project.projectDescription || '';
  const startDate = project.start_date || project.startDate;
  const endDate = project.end_date || project.endDate;
  const status = project.status || 'Not Started';
  const assignedTo = project.assigned_to || project.assignedTo || [];
  const techStack = project.tech_stack || project.techStack || [];
  const clientName = project.client_name || project.clientName || '';
  const leaderOfProject = project.leader_of_project || project.leaderOfProject || '';
  const roles = project.role || [];

  return (
    <Card className="project-card-custom h-100 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="flex-grow-1">
            <h5 className="project-title mb-1">{projectName}</h5>
            <p className="project-subtitle text-muted mb-2">
              {projectDescription ? 
                projectDescription.substring(0, 80) + (projectDescription.length > 80 ? '...' : '') 
                : 'No description available'
              }
            </p>
            {clientName && (
              <div className="d-flex align-items-center text-muted small mb-1">
                <FiUser className="me-1" />
                <span>Client: {clientName}</span>
              </div>
            )}
          </div>
          <FiMoreHorizontal className="text-muted" />
        </div>

        <div className="mb-3">
          <Badge bg={getStatusColor(status)} className="mb-2">
            {status}
          </Badge>
          
          <div className="d-flex align-items-center text-muted small mb-2">
            <FiCalendar className="me-1" />
            <span>{formatDate(startDate)} - {formatDate(endDate)}</span>
          </div>
          
          <div className="d-flex align-items-center text-muted small mb-2">
            <FiClock className="me-1" />
            <span>{calculateDaysLeft(endDate)}</span>
          </div>
          
          {assignedTo && assignedTo.length > 0 && (
            <div className="d-flex align-items-center text-muted small mb-2">
              <FiUsers className="me-1" />
              <span>{assignedTo.length} team member(s)</span>
            </div>
          )}
          
          {leaderOfProject && (
            <div className="d-flex align-items-center text-muted small mb-2">
              <FiUser className="me-1" />
              <span>Leader: {leaderOfProject}</span>
            </div>
          )}
        </div>

        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <small className="text-muted">Progress</small>
            <small className="text-muted">{getProgressValue(status)}%</small>
          </div>
          <ProgressBar 
            now={getProgressValue(status)} 
            variant={getStatusColor(status)}
            className="mb-3"
          />
        </div>

        {techStack && techStack.length > 0 && (
          <div className="mb-3">
            <small className="text-muted d-block mb-1">
              <FiCode className="me-1" />
              Tech Stack:
            </small>
            <div className="d-flex flex-wrap gap-1">
              {techStack.slice(0, 3).map((tech, index) => (
                <Badge key={index} bg="light" text="dark" className="small">
                  {tech}
                </Badge>
              ))}
              {techStack.length > 3 && (
                <Badge bg="light" text="dark" className="small">
                  +{techStack.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {roles && roles.length > 0 && (
          <div className="mb-3">
            <small className="text-muted d-block mb-1">
              <FiFileText className="me-1" />
              Roles:
            </small>
            <div className="d-flex flex-wrap gap-1">
              {roles.slice(0, 2).map((role, index) => (
                <Badge key={index} bg="info" className="small">
                  {role}
                </Badge>
              ))}
              {roles.length > 2 && (
                <Badge bg="info" className="small">
                  +{roles.length - 2} more
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center mt-auto">
          <Link 
            to="/chatbot/DualChatbot" 
            state={{ projectId: project.id, projectName: projectName }}
            className="btn btn-primary btn-sm"
          >
            Create New Chat
          </Link>
          <Link 
            to={`/project/${project.id}`} 
            className="btn btn-outline-secondary btn-sm"
          >
            View Details
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};

const Dashboard = () => {
  const location = useLocation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [stats, setStats] = useState({
    openProjects: 0,
    completedProjects: 0,
    totalHours: 0
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  // Refresh projects when coming from form submission
  useEffect(() => {
    if (location.state?.refreshProjects) {
      console.log('Refreshing projects due to form submission...');
      fetchProjects();
      setShowSuccessAlert(true);
      // Clear the state to prevent unnecessary refreshes
      window.history.replaceState({}, document.title);
      // Hide success alert after 5 seconds
      setTimeout(() => setShowSuccessAlert(false), 5000);
    }
  }, [location.state]);

  // Handle scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      const dashboardContainer = document.querySelector('.dashboard-container');
      if (dashboardContainer) {
        setShowScrollTop(dashboardContainer.scrollTop > 300);
      }
    };

    const dashboardContainer = document.querySelector('.dashboard-container');
    if (dashboardContainer) {
      dashboardContainer.addEventListener('scroll', handleScroll);
      return () => dashboardContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToTop = () => {
    const dashboardContainer = document.querySelector('.dashboard-container');
    if (dashboardContainer) {
      dashboardContainer.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const fetchProjects = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      console.log('Fetching projects...');
      const projectsData = await projectDatabaseSupabase.getAllProjects();
      console.log('Fetched projects:', projectsData);
      
      setProjects(projectsData || []);
      
      // Calculate stats
      const openProjects = projectsData.filter(p => {
        const status = p.status?.toLowerCase();
        return status !== 'completed';
      }).length;
      const completedProjects = projectsData.filter(p => {
        const status = p.status?.toLowerCase();
        return status === 'completed';
      }).length;
      
      setStats({
        openProjects,
        completedProjects,
        totalHours: projectsData.length * 8 // Simple calculation for demo
      });
      
      console.log('Stats updated:', { openProjects, completedProjects, totalProjects: projectsData.length });
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const ongoingProjects = projects.filter(project => {
    const status = project.status || project.status?.toLowerCase();
    const isOngoing = status === 'In Progress' || status === 'Not Started' || status === 'in progress' || status === 'not started';
    console.log(`Project: ${project.project_name || project.projectName}, Status: ${status}, Is Ongoing: ${isOngoing}`);
    return isOngoing;
  });
  
  console.log('Total projects:', projects.length);
  console.log('Ongoing projects:', ongoingProjects.length);

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const result = await projectDatabaseSupabase.deleteProject(projectId);
        if (result.success) {
          console.log('Project deleted successfully');
          await fetchProjects(); // Refresh the projects list
        } else {
          console.error('Failed to delete project:', result.error);
          alert('Failed to delete project. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Error deleting project. Please try again.');
      }
    }
  };

  return (
    <Container fluid className="dashboard-container">
      {showSuccessAlert && (
        <Alert 
          variant="success" 
          onClose={() => setShowSuccessAlert(false)} 
          dismissible
          className="mb-3"
        >
          <strong>Success!</strong> Your project has been created successfully and is now visible in the dashboard.
        </Alert>
      )}
      <Row className="g-8 mb-4 justify-content-center">
        <Col md={3} sm={6} xs={12}>
          <StatCard value={stats.openProjects.toString()} title="Open Projects" />
        </Col>
        <Col md={3} sm={6} xs={12}>
          <StatCard value={stats.completedProjects.toString()} title="Completed Projects" />
        </Col>
        <Col md={3} sm={6} xs={12}>
          <StatCard value={stats.totalHours.toFixed(2)} title="Total Project Hours" />
        </Col>
      </Row>
      
      <Row>
            
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : ongoingProjects.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted">No ongoing projects found.</p>
                <p className="text-muted small">Total projects in database: {projects.length}</p>
                <div className="d-flex justify-content-center gap-2 mt-3">
                  <Button 
                    variant="outline-primary" 
                    onClick={() => fetchProjects(true)}
                    disabled={refreshing}
                  >
                    <FiRefreshCw className={refreshing ? 'spinning me-2' : 'me-2'} />
                    {refreshing ? 'Refreshing...' : 'Refresh Projects'}
                  </Button>
                  <Link to="/project" className="btn btn-primary">
                    <FiPlus className="me-2" />
                    Create New Project
                  </Link>
                </div>
                {projects.length > 0 && (
                  <div className="mt-3 p-3 bg-warning bg-opacity-10 rounded">
                    <p className="small text-warning mb-0">
                      <strong>Note:</strong> Projects exist but may not be showing due to status filtering. 
                      Check the debug section below for all projects.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Debug section - show all projects */}
                {projects.length > 0 && (
                  <div className="debug-section-card">
                    <div className="debug-header">
                      <h6 className="debug-title">Debug Info</h6>
                      <div className="debug-stats">
                        <span className="debug-stat">Total: {projects.length}</span>
                        <span className="debug-stat">Ongoing: {ongoingProjects.length}</span>
                        <span className="debug-stat">Completed: {projects.length - ongoingProjects.length}</span>
                      </div>
                    </div>
                    <div className="debug-details">
                      <h6 className="debug-summary">All Projects</h6>
                      <div className="debug-projects-grid">
                        {projects.map((project, index) => (
                          <div key={project.id} className="debug-project-item">
                            <div className="debug-project-header">
                              <div className="debug-project-title">
                                <span className="project-number">{index + 1}</span>
                                <h6 className="project-name">{project.project_name || project.projectName}</h6>
                              </div>
                              <div className="debug-project-menu">
                                <span className="menu-dots">⋯</span>
                              </div>
                            </div>
                            
                            <div className="debug-project-content">
                              <div className="debug-info-item">
                                <span className="debug-icon">👤</span>
                                <span className="debug-text">Client: {project.client_name || project.clientName || 'Not Set'}</span>
                              </div>
                              
                              <div className="debug-status-badge">
                                {project.status || 'Not Started'}
                              </div>
                              
                              <div className="debug-info-item">
                                <span className="debug-icon">📅</span>
                                <span className="debug-text">{project.start_date || project.startDate || 'No start date'} - {project.end_date || project.endDate || 'No end date'}</span>
                              </div>
                              
                              <div className="debug-info-item">
                                <span className="debug-icon">⏰</span>
                                <span className="debug-text">Project ID: {project.id}</span>
                              </div>
                              
                              {(project.assigned_to || project.assignedTo || []).length > 0 && (
                                <div className="debug-info-item">
                                  <span className="debug-icon">👥</span>
                                  <span className="debug-text">{(project.assigned_to || project.assignedTo || []).length} team member(s)</span>
                                </div>
                              )}
                              
                              {project.leader_of_project || project.leaderOfProject && (
                                <div className="debug-info-item">
                                  <span className="debug-icon">👤</span>
                                  <span className="debug-text">Leader: {project.leader_of_project || project.leaderOfProject}</span>
                                </div>
                              )}
                            </div>
                            
                            {(project.tech_stack || project.techStack || []).length > 0 && (
                              <div className="debug-tech-section">
                                <span className="debug-icon">💻</span>
                                <span className="debug-label">Tech Stack:</span>
                                <div className="debug-tech-badges">
                                  {(project.tech_stack || project.techStack || []).slice(0, 2).map((tech, techIndex) => (
                                    <span key={techIndex} className="debug-tech-badge">{tech}</span>
                                  ))}
                                  {(project.tech_stack || project.techStack || []).length > 2 && (
                                    <span className="debug-tech-badge more">+{(project.tech_stack || project.techStack || []).length - 2} more</span>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            <div className="debug-actions">
                              <Link 
                                to={`/project/${project.id}`} 
                                className="debug-action-btn primary"
                              >
                                View Details
                              </Link>
                              <Link 
                                to="/chatbot/DualChatbot" 
                                state={{ 
                                  projectId: project.id, 
                                  projectName: project.project_name || project.projectName 
                                }}
                                className="btn btn-primary btn-sm"
                              >
                                Create New Chat
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
      </Row>
      
      {/* Scroll to top button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="scroll-to-top-btn"
          variant="primary"
          size="sm"
          title="Scroll to top"
        >
          <FiArrowUp />
        </Button>
      )}
    </Container>
  );
};

export default Dashboard;
