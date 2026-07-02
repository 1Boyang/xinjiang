/**
 * 安装日历页面
 * 展示各区域安装任务的时间安排
 * 
 * 依赖说明：
 * - 本代码为模拟数据展示，实际使用时需通过 openyida get-schema 获取真实字段ID
 * - 如需接入实际数据，将模拟数据替换为 this.utils.yida.searchFormDatas 调用结果
 */

var FIELDS = {
  region: 'selectField_xxx',        // 区域字段
  installType: 'selectField_yyy',  // 安装类型
  startDate: 'dateField_start',    // 开始日期
  endDate: 'dateField_end',        // 结束日期
};

var _customState = {
  region: '',
  startDate: null,
  endDate: null,
  calendarData: [],
  statistics: {
    total: 0,
    activity: 0,
    window: 0,
    drawing: 0,
    pending: 0,
  },
  loading: false,
};

var COLORS = {
  primary: '#1890ff',
  background: '#ffffff',
  navbarBg: '#f5f7fa',
  border: '#e8e8e8',
  textDark: '#333333',
  textGray: '#666666',
  textLight: '#999999',
  activityRed: '#ef473a',
  windowYellow: '#ffc600',
  drawingBlue: '#1890ff',
  pendingGray: '#999999',
};

var REGIONS = [
  '华北(含北京)',
  '东北',
  '华中华南',
  '华东(含上海)',
  '西部(西南西北)',
  '港澳',
  '海外其他',
];

var INSTALL_TYPES = [
  { key: 'activity', label: '活动安装', color: COLORS.activityRed },
  { key: 'window', label: '橱窗安装', color: COLORS.windowYellow },
  { key: 'drawing', label: '画图安装', color: COLORS.drawingBlue },
  { key: 'pending', label: '待定安装', color: COLORS.pendingGray },
];

var isMobile = false;

export function renderJsx() {
  var self = this;
  isMobile = self.utils.isMobile();
  
  return (
    <div style={styles.container}>
      <div style={styles.navbar}>
        <div style={styles.navbarLeft}>
          <button style={styles.navButton}>后退</button>
          <button style={styles.navButton}>前进</button>
          <button style={styles.navButton}>刷新</button>
        </div>
        <div style={styles.navbarCenter}>
          <span style={styles.companyName}>上海汉默展览展示有限公司</span>
          <span style={styles.dropdownArrow}>▼</span>
        </div>
        <div style={styles.navbarRight}>
          <span style={styles.navLink}>钉钉搭</span>
          <span style={styles.navLink}>应用中心</span>
          <span style={styles.navLink}>独立窗口</span>
        </div>
      </div>

      <div style={styles.mainContent}>
        <div style={styles.titleBar}>
          <h1 style={styles.pageTitle}>安装日历</h1>
          <div style={styles.filterArea}>
            <select
              style={styles.select}
              value={_customState.region}
              onChange={(e) => {
                _customState.region = e.target.value;
              }}
            >
              <option value="">全部区域</option>
              {REGIONS.map(function(region, idx) {
                return <option key={idx} value={region}>{region}</option>;
              })}
            </select>

            <input
              type="date"
              style={styles.dateInput}
              value={_customState.startDate ? formatDate(_customState.startDate) : ''}
              onChange={(e) => {
                _customState.startDate = e.target.value ? new Date(e.target.value).getTime() : null;
              }}
            />

            <span style={styles.dateSeparator}>至</span>

            <input
              type="date"
              style={styles.dateInput}
              value={_customState.endDate ? formatDate(_customState.endDate) : ''}
              onChange={(e) => {
                _customState.endDate = e.target.value ? new Date(e.target.value).getTime() : null;
              }}
            />

            <select
              style={styles.select}
              value={_customState.installType}
              onChange={(e) => {
                _customState.installType = e.target.value;
              }}
            >
              <option value="">全部类型</option>
              {INSTALL_TYPES.map(function(type, idx) {
                return <option key={idx} value={type.key}>{type.label}</option>;
              })}
            </select>

            <button
              style={styles.queryButton}
              onClick={(e) => {
                self.handleQuery();
              }}
            >
              查询
            </button>
          </div>
        </div>

        <div style={styles.statisticsBar}>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>总数量：</span>
            <span style={styles.statValue}>{_customState.statistics.total}</span>
          </div>
          {INSTALL_TYPES.map(function(type, idx) {
            return (
              <div key={idx} style={styles.statItem}>
                <span style={Object.assign({}, styles.statLegend, { background: type.color })}></span>
                <span style={styles.statLabel}>{type.label}: </span>
                <span style={styles.statValue}>{_customState.statistics[type.key]}个</span>
              </div>
            );
          })}
        </div>

        <div style={styles.calendarContainer}>
          {renderCalendarTable.call(self)}
        </div>
      </div>
    </div>
  );
}

function renderCalendarTable() {
  var self = this;
  var days = generateCalendarDays();
  
  return (
    <div style={styles.tableWrapper}>
      <table style={styles.table}>
        <thead>
          <tr style={styles.tableHeaderRow}>
            <th style={Object.assign({}, styles.tableHeaderCell, styles.dateColumn)}>日期</th>
            {REGIONS.map(function(region, idx) {
              return (
                <th key={idx} style={styles.tableHeaderCell}>{region}</th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {days.map(function(day, dayIdx) {
            return (
              <tr key={dayIdx} style={styles.tableRow}>
                <td style={Object.assign({}, styles.tableCell, styles.dateColumn)}>
                  <div style={styles.dateCell}>
                    <span style={styles.weekday}>{day.weekday}</span>
                    <span style={styles.dateValue}>{day.dateStr}</span>
                  </div>
                </td>
                {REGIONS.map(function(region, regionIdx) {
                  var tasks = getTasksForDayAndRegion(day.date, region);
                  return (
                    <td key={regionIdx} style={styles.tableCell}>
                      {tasks.map(function(task, taskIdx) {
                        return (
                          <div
                            key={taskIdx}
                            style={Object.assign({}, styles.taskModule, { background: task.color })}
                            onClick={(e) => {
                              self.handleTaskClick(task);
                            }}
                          >
                            <span style={styles.taskTitle}>{task.title}</span>
                            {task.details.map(function(detail, dIdx) {
                              return (
                                <span key={dIdx} style={styles.taskDetail}>{detail}</span>
                              );
                            })}
                          </div>
                        );
                      })}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function formatDate(timestamp) {
  if (!timestamp) return '';
  var date = new Date(timestamp);
  var year = date.getFullYear();
  var month = String(date.getMonth() + 1).padStart(2, '0');
  var day = String(date.getDate()).padStart(2, '0');
  return year + '-' + month + '-' + day;
}

function formatWeekday(date) {
  var weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return weekdays[date.getDay()];
}

function generateCalendarDays() {
  var days = [];
  var today = new Date();
  for (var i = 0; i < 30; i++) {
    var date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push({
      date: date,
      dateStr: formatDate(date.getTime()),
      weekday: formatWeekday(date),
    });
  }
  return days;
}

function getTasksForDayAndRegion(date, region) {
  var allTasks = _customState.calendarData || [];
  var dateStr = formatDate(date.getTime());
  return allTasks.filter(function(task) {
    return task.date === dateStr && task.region === region;
  });
}

export function didMount() {
  var self = this;
  self.loadCalendarData();
  self.loadStatistics();
}

export function loadCalendarData() {
  var self = this;
  _customState.loading = true;
  self.forceUpdate();
  
  setTimeout(function() {
    _customState.calendarData = generateMockData();
    _customState.loading = false;
    self.forceUpdate();
  }, 500);
}

export function loadStatistics() {
  var self = this;
  _customState.statistics = {
    total: 15,
    activity: 4,
    window: 0,
    drawing: 8,
    pending: 3,
  };
  self.forceUpdate();
}

export function handleQuery() {
  var self = this;
  _customState.loading = true;
  self.forceUpdate();
  
  setTimeout(function() {
    _customState.calendarData = generateMockData();
    _customState.loading = false;
    self.forceUpdate();
    self.utils.toast({ title: '查询完成', type: 'success' });
  }, 800);
}

export function handleTaskClick(task) {
  var self = this;
  self.utils.toast({ title: '跳转至: ' + task.title, type: 'info' });
}

function generateMockData() {
  var mockData = [];
  var today = new Date();
  
  var regions = REGIONS;
  var types = INSTALL_TYPES;
  
  for (var i = 0; i < 15; i++) {
    var taskDate = new Date(today);
    taskDate.setDate(today.getDate() + Math.floor(i / 2));
    
    var typeIndex = i % types.length;
    var regionIndex = i % regions.length;
    
    mockData.push({
      id: 'task_' + i,
      date: formatDate(taskDate.getTime()),
      region: regions[regionIndex],
      title: 'MONCLER-MONCLER北京三里屯',
      color: types[typeIndex].color,
      details: [
        '橱窗(70周年橱窗拆除)',
        '杭州门店',
        '活动',
      ],
      type: types[typeIndex].key,
    });
  }
  
  return mockData;
}

var styles = {
  container: {
    minHeight: '100vh',
    background: COLORS.background,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  navbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: isMobile ? '44px' : '48px',
    padding: '0 16px',
    background: COLORS.navbarBg,
    borderBottom: '1px solid ' + COLORS.border,
  },
  navbarLeft: {
    display: 'flex',
    gap: '8px',
  },
  navbarCenter: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  navbarRight: {
    display: 'flex',
    gap: '16px',
  },
  navButton: {
    padding: '4px 12px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: '13px',
    color: COLORS.textDark,
  },
  companyName: {
    fontSize: '14px',
    fontWeight: '500',
    color: COLORS.textDark,
  },
  dropdownArrow: {
    fontSize: '10px',
    color: COLORS.textGray,
  },
  navLink: {
    fontSize: '13px',
    color: COLORS.primary,
    cursor: 'pointer',
  },
  mainContent: {
    padding: '16px',
  },
  titleBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  pageTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: COLORS.textDark,
    margin: '0',
  },
  filterArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  select: {
    height: '32px',
    padding: '0 12px',
    border: '1px solid ' + COLORS.border,
    borderRadius: '4px',
    fontSize: '13px',
    color: COLORS.textDark,
    background: COLORS.background,
    cursor: 'pointer',
    minWidth: '120px',
  },
  dateInput: {
    height: '32px',
    padding: '0 8px',
    border: '1px solid ' + COLORS.border,
    borderRadius: '4px',
    fontSize: '13px',
    color: COLORS.textDark,
  },
  dateSeparator: {
    color: COLORS.textGray,
    fontSize: '13px',
  },
  queryButton: {
    height: '32px',
    padding: '0 24px',
    border: 'none',
    borderRadius: '4px',
    background: COLORS.primary,
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  statisticsBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    padding: '12px 16px',
    background: COLORS.navbarBg,
    borderRadius: '4px',
    marginBottom: '16px',
    flexWrap: 'wrap',
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  statLabel: {
    fontSize: '14px',
    color: COLORS.textDark,
  },
  statValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: COLORS.textDark,
  },
  statLegend: {
    width: '12px',
    height: '12px',
    borderRadius: '2px',
  },
  calendarContainer: {
    overflow: 'auto',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '13px',
  },
  tableHeaderRow: {
    background: COLORS.navbarBg,
  },
  tableHeaderCell: {
    padding: '12px 8px',
    border: '1px solid ' + COLORS.border,
    textAlign: 'center',
    fontWeight: '600',
    color: COLORS.textDark,
    whiteSpace: 'nowrap',
  },
  tableRow: {
    borderBottom: '1px solid ' + COLORS.border,
  },
  tableCell: {
    padding: '8px',
    border: '1px solid ' + COLORS.border,
    verticalAlign: 'top',
    minWidth: '150px',
  },
  dateColumn: {
    minWidth: '100px',
    background: COLORS.navbarBg,
  },
  dateCell: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  weekday: {
    fontSize: '13px',
    color: COLORS.textGray,
  },
  dateValue: {
    fontSize: '14px',
    fontWeight: '500',
    color: COLORS.textDark,
  },
  taskModule: {
    padding: '8px',
    marginBottom: '6px',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  taskTitle: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: '4px',
  },
  taskDetail: {
    display: 'block',
    fontSize: '12px',
    color: 'rgba(255,255,255,0.9)',
    lineHeight: '1.4',
  },
};