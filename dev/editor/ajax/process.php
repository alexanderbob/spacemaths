<?PHP
    $return = array('code' => 0, 'data' => array(), 'debug' => 'Param error');
    if (isset($_GET['command']) && isset($_GET['callback']))
    {
        $cmd = $_GET['command'];
        include_once '../php/core.php';
        $core = new Core();
        $data = $core->process($cmd, $_GET);
        if ($data)
        {
            $return = $data;
            /*$return['code'] = 1;
            $return['debug'] = 'ok';
            $return['data'] = $data;*/
        }
        else
        {
            $return['debug'] = 'some error occured';
        }
    }
    print $_GET['callback'].'('.json_encode($return).')';
?>