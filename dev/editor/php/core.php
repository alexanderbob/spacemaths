<?PHP
    error_reporting(E_ALL);
    ini_set("display_errors", 1);

    class Core {
        const CMD_GETLIST = 'get';
		const CMD_UPDATE  = 'update';
		const CMD_GET_FILENAMES = 'getfiles';
        
		const UPDATE_CODE_OK		= 1;
		const UPDATE_CODE_DUPLICATE = 2;
        private $data = array();
        private $filePath = '../../../files/proto.json';
		private $oldFilesPath = '../history/proto_';
        private $imgsPath = '../../../files/img';

        function __construct() {
            $temp = file_get_contents($this->filePath);
            $this->data = json_decode($temp, true);
        }

        public function process($cmd, $params = false) {
            switch ($cmd)
            {
                case self::CMD_GETLIST:
				{
					return array('code' => 1, 'data' => $this->data, 'debug' => 'ok');
				}
                case self::CMD_GET_FILENAMES:
                    return array('code' => 1, 'data' => $this->getImgFileNames(), 'debug' => 'ok');
				case self::CMD_UPDATE:
				{
					//remove jQuery's _ and callback params
					$ret = $this->updateProto($params);
					if ($ret['code'] == self::UPDATE_CODE_OK)
					{
						$this->saveFile();
                        $ret['debug'] = 'saved';
					}
                    else
                    {
                        $ret['debug'] = $ret['message'];
                    }
					return array('code' => $ret['code'], 'debug' => $ret['debug'], 'data' => $ret['message']);
				}
            }
        }
        
		public function updateProto($params) {
			if (strcmp($params['SID'], $params['prevSID']))
			{
			    //insert new value
				if (isset($this->data[ $params['SID'] ]))
				{
					return array('code' => self::UPDATE_CODE_DUPLICATE, 'message' => 'Record with key '.$params['SID'].' already exist');
				}
                //update SID
                if (isset($params['prevSID']) && !empty($params['prevSID']))
                {
                    $this->data[ $params['SID'] ] = $this->data[ $params['prevSID'] ];
                    unset($this->data[ $params['prevSID'] ]);
                }
			}
			$proto = array();//$this->data[ $params['SID'] ];
			$sid = $params['SID'];
			unset($params['_']);
			unset($params['callback']);
			unset($params['command']);
			unset($params['prevSID']);
			unset($params['SID']);
            foreach ($params as $key => $val)
			{
				$proto[$key] = $val;
            }
			$this->data[ $sid ] = $proto;
			return array('code' => self::UPDATE_CODE_OK, 'message' => json_encode($this->data[$sid]));
		}
		
		public function saveFile() {
			//backup file
			rename($this->filePath, $this->oldFilesPath.date('Y_m_d-H_i_s').'.json');
			//create new file and store data there
			file_put_contents($this->filePath, json_encode($this->data));
		}

        private function getImgFileNames() {
            $return = array();
            if ($handle = opendir($this->imgsPath))
            {
                while (false !== ($entry = readdir($handle))) 
                {
                    if ($entry != "." && $entry != "..") 
                    {
                        $return[] = $entry;
                    }
                }
                closedir($handle);
            }
            return $return;
        }
    }
?>