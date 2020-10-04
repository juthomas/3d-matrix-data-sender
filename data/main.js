var Socket;
function start()
{
    Socket = new WebSocket('ws://' + window.location.hostname + ':81/');
    Socket.onmessage = function (evt)
        {
            document.getElementById("rxConsole").value += evt.data;
        }
}
function enterpressed()
{
    if (document.getElementById("txbuff").value == "")
    {
        Socket.send("\n");
    }
    else
    {
        Socket.send(document.getElementById("txbuff").value);
        document.getElementById("txbuff").value="";
    }
}